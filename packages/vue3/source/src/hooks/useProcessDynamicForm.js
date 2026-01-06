import { onMounted, onUnmounted, ref, reactive, inject, useTemplateRef } from 'vue';
import { compile } from '@vue/compiler-dom';
import * as VueModule from 'vue';

/**
 * 
 * @param {*} processData
 * name
 * processPrefixValue
 */
export function useProcessDynamicForm({ instance, processData, $i18n, frontend, $refs }) {

  const formTemplate = ref('');
  const needReplaced = ref(false);

  function strMatchAll(regex, str) {
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      matches.push(match);
    }
    return matches;
  }

  function defineProcessFormComponent({ template, formData }) {
    const componentKeys = Object.keys(instance.setupState).filter((key) => !!instance.setupState[key]?.setup);
    const components = {};
    componentKeys.forEach((key) => components[key] = instance.setupState[key]);
    const DynamicComponent = VueModule.defineComponent({
      name: 'DynamicComponent',
      props: ['i18n'],
      setup(_props, _ctx) {
        const processDetailFormData = instance.setupState.processDetailFormData;
        Object.assign(processDetailFormData, formData);

        const regex = new RegExp(`ref-name="([^"]+)"`, 'g');
        const matches = strMatchAll(regex, template);
        const refs = {};
        matches.forEach((match, index) => {
          if (match[1] && !match[1].startsWith('template_')) {
            refs[match[1]] = useTemplateRef(match[1]);
          }
          if (index === 0) {
            refs.processFormRef = refs[match[1]];
          }
        })

        onMounted(() => {
          // 在这里可以访问到 $refs
          window.__processDetailFromMixinFormVm__ = refs.processFormRef?.value;
          Object.keys(refs).forEach((key) => {
            $refs[key] = refs[key].value;
          });
        })

        onUnmounted(() => {
          window.__processDetailFromMixinFormVm__ = null;
          window.__processDetailFromMixinFormData__ = null;
        })

        return Object.assign({
          processDetailFormData,
        },instance.setupState) 
      },
      components,
      render(_ctx) {
        const { code } = compile(template);
        const renderComponent = new Function('Vue', '$t', code)(VueModule, $i18n.t);
        const _ctxData = Object.assign({}, _ctx, instance.setupState);
        return renderComponent(_ctxData);
      },
    });
    return DynamicComponent;
  }

  function sliceStrByTag(tag, referIndex, startIndex = 0, endIndex = Infinity) {
    const sliceEndIndex = (() => {
      const regex = new RegExp(`</${tag}[a-zA-Z-]+>`);
      const match = formTemplate.value.slice(referIndex).match(regex);
      return match ? referIndex + match.index + match[0].length : -1;
    })();
    if (sliceEndIndex > -1 && sliceEndIndex < endIndex) {
      const sliceStartIndex = (() => {
        const regex = new RegExp(`<${tag}[^>]*>`, 'g');
        const subString = formTemplate.value.slice(0, sliceEndIndex);
        const matches = [...strMatchAll(regex, subString)];
        return matches.length ? matches[matches.length - 1].index : -1;
      })();
      if (sliceStartIndex > -1 && sliceStartIndex > startIndex) {
        return formTemplate.value.substring(sliceStartIndex, sliceEndIndex);
      }
    }
    return '';
  }

  function modifyFieldTemplateByPermission(replaceTemplateList, propertyName, fieldStr, permission, tag, relationDataName) {
    let startIndex = 0, endIndex = Infinity;
    if (relationDataName) {
      const tableIndexConfig = getRelationDataStartAndEndIndex(relationDataName)
      startIndex = tableIndexConfig.tableStartIndex
      endIndex = tableIndexConfig.tableEndIndex
    }
    let itemStr = '';
    const replaceStr = `<span text=${fieldStr}></span>`;
    const fieldStrIndex = formTemplate.value.indexOf(fieldStr, startIndex);
    if (fieldStrIndex > -1 && fieldStrIndex < endIndex) {
      itemStr = sliceStrByTag(tag, fieldStrIndex, startIndex, endIndex);
      if (permission === 'hidden') {
        formTemplate.value = formTemplate.value.replace(itemStr, '');
        return startIndex;
      } else if (['readOnly', 'preview'].includes(permission)) {
        let newItemStr = itemStr;
        if (itemStr.includes(':preview')) {
          const match = itemStr.match(/:preview="([^"]+)"/);
          if (match && match[0]) {
            newItemStr = itemStr.replace(match[0], `:preview="true" `);
          }
        } else if (!itemStr.includes(':preview')) {
          newItemStr = itemStr.replace(fieldStr, `${fieldStr} :preview="true" `);
        }
        formTemplate.value = formTemplate.value.replace(itemStr, newItemStr);
        itemStr = newItemStr;
      }
      replaceTemplateList.push({
        propertyName,
        origin: itemStr,
        replace: replaceStr
      });
    }
    return startIndex;
  }

  function getRelationDataStartAndEndIndex(relationDataName) {
    const tag = 'el-table';
    let tableStartIndex = -1;
    let tableEndIndex = -1;
    const reg = new RegExp(`dataSource(?:\\.sync)?="[^"]*processDetailFormData[^"]*\\.${relationDataName}"`, 'g');
    const match = formTemplate.value.match(reg);
    if (match && match.length) {
      const relationDataStr = match[0], relationDataStrIndex = formTemplate.value.indexOf(relationDataStr);
      tableEndIndex = formTemplate.value.indexOf('</' + tag + '>',relationDataStrIndex);
      if (tableEndIndex > -1) {
        tableStartIndex = formTemplate.value.lastIndexOf('<' + tag + ' ',tableEndIndex);
      }
    }
    return { tableStartIndex, tableEndIndex };
  }

  function cutStrByTag(template, tag, filterReferStr) {
    const filterReferStrIndex = template.indexOf(filterReferStr);
    const endIndex = template.indexOf(`</${tag}>`, filterReferStrIndex);
    if (endIndex > -1) {
      const startIndex = template.lastIndexOf(`<${tag} `, endIndex);
      if (startIndex > -1) {
        const targetStr = template.substring(startIndex, endIndex + (`</${tag}>`).length);
        return template.replace(targetStr, '');
      }
    }
    return template;
  }

  function previewSubFormTemplate(stencilStr) {
    stencilStr = cutStrByTag(stencilStr, 'el-button', ':subFormBtnType="\`add\`"' )
    stencilStr = cutStrByTag(stencilStr, 'el-button', ':subFormBtnType="\`export\`"' )
    stencilStr = cutStrByTag(stencilStr, 'el-table-column', ':subFormInitialColumn="\`action\`"' )
    return stencilStr
  }

  async function getTemplate() {
    const taskId = instance?.setupState?.state?.taskId;
    if (!taskId) return;
    let templateProcessDetailFrom = await window.$systemProcessV2.getProcessFormDefinition({
      body: { taskId }
    })
    formTemplate.value = templateProcessDetailFrom;

    // 获取表单数据
    let formData = await window.$systemProcessV2.getTaskInstanceForm({ body: { taskId } })
    // 获取流程变量
    const processVars = await window.$systemProcessV2.getProcVariable({ body: { taskId } })
    formData = { ...formData, ...processVars }
    // 获取字段权限
    const fieldPermission = await window.$systemProcessV2.getFieldPermissionDetail({ body: { taskId } })

    const itemTag = frontend.type === 'pc' ? 'el-form-' : 'van-form-';

    // 主表单的字段权限
    const mainPerms = fieldPermission?.[0]?.subFieldPermissions || []
    // 主表字段渲染错误时的替换模版
    const mainReplTemplates = []
    mainPerms.forEach(({propertyName, permission}) => {
      const fieldStrReg = new RegExp('"[^"]*processDetailFormData[^"]*\\.data[^"]*\\.' + propertyName + '"', "g");
      const fieldStr = formTemplate.value.match(fieldStrReg)?.[0];
      if (!fieldStr) return;
      modifyFieldTemplateByPermission(mainReplTemplates ,propertyName, fieldStr, permission,itemTag);
    })

    // n个子表单的字段权限 (n>=0)
    const subPerms = fieldPermission?.slice(1) || []
    // 子字段渲染错误时的替换模版
    const subReplTemplates = []

    if (subPerms.length && frontend.type === 'pc') {
      const fieldTag = 'el-table-column', stencilTag = 'el-col';
      // 遍历每个子表单
      subPerms.forEach((relationData) => {
        const { propertyName, subFieldPermissions, permission } = relationData;
        // step1: 判断是否存在当前子表单
        let { tableStartIndex, tableEndIndex } = getRelationDataStartAndEndIndex(propertyName)
        if (tableStartIndex === -1 || tableEndIndex === -1) return;
        let stencilStr = sliceStrByTag(stencilTag, tableStartIndex);
        // step2: 根据子表单整体权限，控制子表单的部分节点 或 整个子表单 的隐藏
        if (['readOnly', 'preview'].includes(permission)){
          const newStencilStr = previewSubFormTemplate(stencilStr)
          formTemplate.value = formTemplate.value.replace(stencilStr, newStencilStr)
          stencilStr = newStencilStr
        } else if(permission === 'hidden'){
          formTemplate.value = formTemplate.value.replace(stencilStr, '')
          return;
        }
        // step3: 初始化存放槽位
        const curReplTemplates = []
        subReplTemplates.push(curReplTemplates);
        // step4: 遍历当前子表单的字段权限
        subFieldPermissions.forEach(({ propertyName: fieldName, permission: fieldPermission }, index) => {
          const fieldStr = `"current.item.${fieldName}"`;
          tableStartIndex = modifyFieldTemplateByPermission(curReplTemplates, fieldName, fieldStr, fieldPermission,fieldTag, propertyName);
          // step5: 当前子表单首次渲染时，会去除掉所有列，来检查当前子表单内是否有其他因素导致渲染失败
          if (index === subFieldPermissions.length - 1) {
            stencilStr = sliceStrByTag(stencilTag, tableStartIndex);
            const replaceStencilStr = `<span text="processDetailFormData.${propertyName}"></span>`
            curReplTemplates.unshift({
              propertyName,
              origin: stencilStr,
              replace: replaceStencilStr
            })
          }
        })
      })
    }

    return {
      template: formTemplate.value,
      formData,
      processVars,
      mainReplTemplates,
      subReplTemplates,
    };
  }

  function dynamicRender({ template, formData, parentElement }) {
    const processFormComponent = defineProcessFormComponent({
      template,
      formData,
    });
    const i18n = instance.appContext.config.globalProperties.$i18n;
    const vnode = VueModule.h(processFormComponent, { i18n });
    try {
      VueModule.render(vnode, parentElement);
      needReplaced.value = false;
    } catch (error) {
      needReplaced.value = true;
      console.error(error);
    }
  }

  function reRenderForm ({fieldReplTemplates, isSubForm, formData, parentElement, formTemplate}) {
    for (let i = 0; i < fieldReplTemplates.length; i++) {
      const { propertyName, origin, replace } = fieldReplTemplates[i] || {};
      // step1: 如果上一次渲染失败，更换为替换模版
      if (needReplaced.value && i > 0) {
        fieldReplTemplates[i - 1].isError = true;
      }
      // 避免有下拉框等会多次调用接口，再还原回去
      if (i > 0) {
        const { origin: lastOrigin, replace: lastReplace } = fieldReplTemplates[i - 1];
        formTemplate = formTemplate.replace(lastOrigin, lastReplace);
      }
      // step2: 如果子表单的首次渲染失败，则不在继续替换后续模版，直接取消掉该子表单的渲染
      if (isSubForm && needReplaced.value && i === 1) {
        for (let j = 1; j < fieldReplTemplates.length; j++) {
          fieldReplTemplates[j].isError = true;
        }
        break;
      }
      // step3: 尝试用原始模板渲染
      if (propertyName) formTemplate = formTemplate.replace(replace, origin);
      // step4: 动态渲染
      if (propertyName || needReplaced.value || i === 0) {
        dynamicRender({ formData, parentElement, template: formTemplate });
      }
    }
    needReplaced.value = false;
  }

  function reDynamicRenderForm({ templateData, parentElement }) {
      let formTemplateForRender = formTemplate.value;
      const replaceFormTemplateToReplacer = (fieldReplTemplates) => {
        for (let i = 0; i < fieldReplTemplates.length; i++) {
          const { origin, replace } = fieldReplTemplates[i];
          formTemplateForRender = formTemplateForRender.replace(origin, replace);
        }
      }
      replaceFormTemplateToReplacer(templateData.mainReplTemplates);
      templateData.subReplTemplates.forEach((fieldReplTemplates) => {
        replaceFormTemplateToReplacer(fieldReplTemplates);
      });
      // 动态渲染主表单
      reRenderForm({
        fieldReplTemplates: templateData.mainReplTemplates,
        isSubForm: false,
        formData: templateData.formData,
        parentElement,
        formTemplate: formTemplateForRender
      });
      // 动态渲染子表单
      templateData.subReplTemplates.forEach((fieldReplTemplates) => {
        reRenderForm({
          fieldReplTemplates,
          isSubForm: true,
          formData: templateData.formData,
          parentElement,
          formTemplate: formTemplateForRender
        })
      })
      
      // 替换掉有错误的选项
      const replaceFormTemplateOrigin = (fieldReplTemplates) => {
        for (let i = 0; i < fieldReplTemplates.length; i++) {
          const { origin, replace, isError } = fieldReplTemplates[i];
          if (isError) {
            formTemplate.value = formTemplate.value.replace(origin, replace);
          }
        }
      }
      replaceFormTemplateOrigin(templateData.mainReplTemplates);
      templateData.subReplTemplates.forEach((fieldReplTemplates) => {
        replaceFormTemplateOrigin(fieldReplTemplates);
      });
      dynamicRender({ formData: templateData.formData, parentElement, template: formTemplate.value });
  }

  async function handleRenderForm() {
    const container = document.getElementById('dynamicRenderContainer');
    if (!container) return;
    // 先创建一个空div替换dynamicRenderContainer
    const parentElement = container.parentNode;
    const divEl = document.createElement('div');
    parentElement.insertBefore(divEl, container);
    parentElement.removeChild(container);

    try {
      const templateData = await getTemplate();
      if (!formTemplate.value) return;

      // 先渲染，如果报错，再一个个item渲染，去除报错的item
      dynamicRender({ formData: templateData.formData, parentElement: divEl, template: formTemplate.value });

      if (needReplaced.value) {
        reDynamicRenderForm({
          templateData,
          parentElement: divEl,
        });
      }
      if (templateData.processVars && templateData.formData) {
        const processVarsKeys = Object.keys(templateData.processVars);
        const data = {};
        for (const key in templateData.formData) {
          if (!processVarsKeys.includes(key)) {
            data[key] = templateData.formData[key];
          }
        }
        window.__processDetailFromMixinFormData__ = data;
      }
    } catch (error) {
      console.error('动态渲染表单失败：', error);
    } finally {
      window.__processDetailFromMixinFormData__ = null;
      window.__processDetailFromMixinFormVm__ = null;
    }
  }

  onMounted(() => {
    handleRenderForm();
  });
}
