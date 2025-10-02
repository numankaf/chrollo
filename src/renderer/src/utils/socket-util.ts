export const openStompSocket = (url: string) => {
  window.electron.ipcRenderer.send('stomp:connect', url);
};

export const subscribeTopics = () => {
  window.electron.ipcRenderer.send('stomp:subscribe', '/topic/scope-bsi-command');
  window.electron.ipcRenderer.send('stomp:subscribe', '/topic/scope-bsi-event');
};

export const sendStompMessage = () => {
  window.electron.ipcRenderer.send('stomp:send', {
    destination: '/app/topic/scope-bsi-command/545445',
    body: JSON.stringify({ command: 'ping' }),
    headers: { priority: '9' },
  });
};
