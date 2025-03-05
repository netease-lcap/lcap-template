import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "../Router";

let root: any = null;

export function renderApp() {
  // @ts-expect-error
  const container = window.LcapMicro?.container ?? document.getElementById('app')!;
  // TODO wudengke 根据合适的上下文获取app
  root = ReactDOM.createRoot(container);
  // @ts-expect-error
  window.createLcapApp = renderApp;
  // @ts-expect-error
  window.appVM = {
    $destroy: unmountApp,
  };
  root.render(<App />);
}

export function unmountApp(){
  // @ts-expect-error
  window.appVM = null;
  // @ts-expect-error
  window.createLcapApp = null;
  root?.unmount();
  root = null;
}

export function loadAssets(){
  return renderApp();
}
