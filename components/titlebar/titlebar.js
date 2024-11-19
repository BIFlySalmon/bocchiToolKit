document.getElementById('minimize').addEventListener('click', () => {
  parent.postMessage({ action: 'minimize' }, '*');
});

document.getElementById('maximize').addEventListener('click', () => {
  parent.postMessage({ action: 'maximize' }, '*');
});

document.getElementById('close').addEventListener('click', () => {
  parent.postMessage({ action: 'close' }, '*');
});
