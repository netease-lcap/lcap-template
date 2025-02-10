import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { genBaseOptions } from "./index";

const MAX_RETRY_TIME = 0;
const EventStreamContentType = "text/event-stream";

export const sseRequester = function (requestInfo) {
  const { url, config = {} } = requestInfo;

  const controller = new AbortController();

  const { body } = url;
  const { onMessage, onClose, onError, ...rest } = body;
  body.onMessage = undefined;
  body.onClose = undefined;
  body.onError = undefined;

  const options = genBaseOptions(requestInfo);

  function close() {
    controller.abort();
  }

  function formatMessage(m: EventSourceMessage) {
    return onMessage?.(m.data, m.event);
  }

  let leftRetries = Math.max((body?.retryTimes ?? MAX_RETRY_TIME) - 1, 0);
  fetchEventSource(url.path, {
    ...options,
    body: JSON.stringify(rest),
    signal: controller.signal,
    openWhenHidden: true, // 当窗口被隐藏时，阻止再次发送请求
    onmessage: formatMessage,
    onclose: onClose,
    onopen: async (response) => {
      if (leftRetries < 0) {
        close();
      }
      const contentType = response.headers.get("content-type");
      if (contentType !== EventStreamContentType) {
        throw new Error(`Expected content-type to be ${EventStreamContentType}, Actual: ${contentType}`);
      }
    },
    onerror: (e) => {
      leftRetries--;
      onError?.(e);
    },
  }).catch((e) => {
    // catch err
    console.error(e);
  });

  return Promise.resolve({
    data: {
      __close: close,
    },
    status: 200,
  });
};
