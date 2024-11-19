window.addEventListener('message', (event) => {
  const { action } = event.data;
  switch (action) {
    case 'minimize':
      window.electronAPI.winMinimize();
      break;
    case 'maximize':
      window.electronAPI.winMaximize();
      break;
    case 'close':
      window.electronAPI.winClose();
      break;
  }
});
