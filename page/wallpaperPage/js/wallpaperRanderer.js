document.getElementById('wallpaperVideo').addEventListener('click', () => {
    
    console.log('壁纸类型:', response);
});

document.addEventListener('DOMContentLoaded', function() {
    let wallpaperType = window.settingsAPI.settingsGet('wallpaperType');
    let wallpaperPath = window.settingsAPI.settingsGet('wallpaperPath');
    
    switch(wallpaperType)
    {
        case 'img':
            document.getElementById('wallpaperVideo').style.display="none";
            document.getElementById('wallpaperIframe').style.display="none";
            document.getElementById('wallpaperImg').src = wallpaperPath;
            break;
        case 'video':
            document.getElementById('wallpaperImg').style.display="none";
            document.getElementById('wallpaperIframe').style.display="none";
            document.getElementById('wallpaperVideo').src = wallpaperPath;
            break;
        case 'url':
            document.getElementById('wallpaperImg').style.display="none";
            document.getElementById('wallpaperVideo').style.display="none";
            document.getElementById('wallpaperIframe').src = wallpaperPath;
            break;
        case 'bilibili':
            document.getElementById('wallpaperImg').style.display="none";
            document.getElementById('wallpaperVideo').style.display="none";
            document.getElementById('wallpaperIframe').style.display="none";
            document.getElementById('wallpaperbilibili').src='https://player.bilibili.com/player.html?bvid='+ wallpaperPath +'&page=1';
            break;
        default:
            alert('壁纸类型错误！');
            break;
    }

});