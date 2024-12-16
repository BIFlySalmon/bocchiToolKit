// 监听右键点击事件，触发右键菜单
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.electronAPI.showContextMenu({ x: e.x, y: e.y, path: document.getElementById('imgshow').src.substring(8) });
});



window.electronAPI.getImgPath((event, imgpath) => {
    console.log('Received file path:', imgpath);
    const img = document.getElementById('imgshow');
    img.src = `file://${imgpath}`;

    // 设置初始的缩放比例和位置
    img.style.transform = "scale(1)";
    img.style.left = "0px";
    img.style.top = "0px";
    img.style.transition = "transform 0.1s ease"; // 平滑的缩放过渡效果
});

let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;

const img = document.getElementById('imgshow');

// 监听整个文档的鼠标滚轮事件来进行缩放
document.addEventListener('wheel', (e) => {
    e.preventDefault();

    // 获取缩放系数
    const scaleFactor = 1.1;

    // 如果滚轮向上则放大，向下则缩小
    if (e.deltaY < 0) {
        scale *= scaleFactor;
    } else {
        scale /= scaleFactor;
    }

    // 获取窗口中心位置
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // 设置 transformOrigin 为窗口中心
    img.style.transformOrigin = `${centerX}px ${centerY}px`;

    // 设置图片的缩放效果
    img.style.transform = `scale(${scale})`;

});

// 禁用默认的图片拖动行为
img.ondragstart = (e) => {
    e.preventDefault(); // 禁止拖动图片文件
};

// 监听鼠标按下事件来开始拖动
img.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    img.style.cursor = 'grabbing'; // 鼠标抓取状态
});

// 监听鼠标移动事件来拖动图片
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        img.style.left = `${posX}px`;
        img.style.top = `${posY}px`;
    }
});

// 监听鼠标松开事件来结束拖动
document.addEventListener('mouseup', () => {
    isDragging = false;
    img.style.cursor = 'grab'; // 恢复鼠标状态
});
