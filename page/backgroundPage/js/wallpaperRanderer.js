document.addEventListener('DOMContentLoaded', function() {

    let wallpaperType = window.settings.get('wallpaperType');
    let wallpaperPath = window.settings.get('wallpaperPath');
    
    switch(wallpaperType)
    {
        case 'img':
            document.getElementById('wallpaperImg').src = wallpaperPath;
            break;
        case 'video':
            document.getElementById('wallpaperVideo').src = wallpaperPath;
            break;
        case 'url':
            document.getElementById('wallpaperIframe').src = wallpaperPath;
            break;
        default:
            alert('壁纸类型错误！');
            break;
    }

});