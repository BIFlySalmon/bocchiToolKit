window.electronAPI.getImgPath((event, imgpath) => {
    console.log('Received file path:', imgpath);
    document.getElementById('imgshow').src = `file://${imgpath}`;
});

// 监听右键点击事件，触发右键菜单
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.electronAPI.showContextMenu({ x: e.x, y: e.y, path: document.getElementById('imgshow').src.substring(8) });
});

//  // 获取 div 元素
//  const follower = document.getElementById('follower');

//  // 监听 mousemove 事件
//  document.addEventListener('mousemove', (event) => {
//    // 更新 div 的位置到鼠标位置
//    follower.style.left = `${event.pageX - follower.offsetWidth / 2}px`;
//    follower.style.top = `${event.pageY - follower.offsetHeight / 2}px`;
//  });