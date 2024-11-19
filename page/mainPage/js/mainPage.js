document.getElementById('restoreDesktop').addEventListener('click', () => {
    window.electronAPI.restoreDesktop();
});

document.getElementById('createDesktop').addEventListener('click', () => {
    window.electronAPI.createDesktop();
});
