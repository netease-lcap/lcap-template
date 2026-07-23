module.exports = {
  preset: {
    name: 'conventionalcommits',
    types: [
      { type: 'feat', section: '### 新增' },
      { type: 'fix', section: '### 修复' },
      { type: 'perf', section: '### 优化' },
      { type: 'refactor', section: '### 重构' },
      { type: 'docs', section: '### 文档' },
      { type: 'style', section: '### 样式' },
      { type: 'test', section: '### 测试' },
      { type: 'build', section: '### 构建' },
      { type: 'ci', section: '### CI' },
      { type: 'chore', section: '### 其他' },
      { type: 'revert', section: '### 撤销' },
    ],
  },
  parserOpts: {
    headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
  },
  writerOpts: {
    transform(commit, context) {
      let discard = true;
      const issues = [];

      commit.notes.forEach((note) => {
        note.title = '### BREAKING CHANGES';
        discard = false;
      });

      // 类型映射
      if (commit.type === 'feat') {
        commit.type = '新增';
        discard = false;
      } else if (commit.type === 'fix') {
        commit.type = '修复';
        discard = false;
      } else if (commit.type === 'perf') {
        commit.type = '优化';
        discard = false;
      } else if (commit.type === 'refactor') {
        commit.type = '重构';
        discard = false;
      } else if (commit.type === 'docs') {
        commit.type = '文档';
        discard = false;
      } else if (commit.type === 'style') {
        commit.type = '样式';
        discard = false;
      } else if (commit.type === 'test') {
        commit.type = '测试';
        discard = false;
      } else if (commit.type === 'build') {
        commit.type = '构建';
        discard = false;
      } else if (commit.type === 'ci') {
        commit.type = 'CI';
        discard = false;
      } else if (commit.type === 'chore') {
        commit.type = '其他';
        discard = false;
      } else if (commit.type === 'revert') {
        commit.type = '撤销';
        discard = false;
      }

      if (discard) return;

      if (commit.scope === '*') {
        commit.scope = '';
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }
        return false;
      });

      return commit;
    },
    groupBy: 'type',
    commitGroupsSort(a, b) {
      const order = ['新增', '修复', '优化', '重构', '文档', '样式', '测试', '构建', 'CI', '其他', '撤销'];
      const aIndex = order.indexOf(a.title);
      const bIndex = order.indexOf(b.title);
      return aIndex - bIndex;
    },
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
  },
  recommendedBumpOpts: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
};
