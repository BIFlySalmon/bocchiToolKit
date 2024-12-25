const audioDevicesSelect = document.getElementById('audioDevices');
const canvas = document.getElementById('audioCanvas');
const canvasCtx = canvas.getContext('2d');
let audioContext, analyser, dataArray, source;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 可供选择的音频输入源
// async function getAudioDevices() {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const audioDevices = devices.filter(device => device.kind === 'audioinput');
//     audioDevicesSelect.innerHTML = '';
  
//     audioDevices.forEach(device => {
//       const option = document.createElement('option');
//       option.value = device.deviceId;
//       option.textContent = device.label || `Audio Device ${audioDevicesSelect.length + 1}`;
//       audioDevicesSelect.appendChild(option);
//     });
//   }


async function getAudioDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioDevices = devices.filter(device => device.kind === 'audioinput');
  audioDevicesSelect.innerHTML = '';

  let stereoMixFound = false;

  audioDevices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.textContent = device.label || `Audio Device ${audioDevicesSelect.length + 1}`;
    audioDevicesSelect.appendChild(option);

    // 检查设备名是否包含“Stereo Mix”或“立体声混音”
    if (!stereoMixFound && /stereo mix|立体声混音/i.test(device.label)) {
      option.selected = true; // 将此设备设置为选中状态
      stereoMixFound = true;
    }

  });

  // 如果没有找到“立体声混音”，则不启动功能并弹出警告
  if (!stereoMixFound && audioDevices.length > 0) {
    // audioDevicesSelect.firstChild.selected = true; //默认选择第一个，大概率是默认麦克风
    window.electronAPI.showMessageBox('mainPage', 'info', ['确定'], 0, 0, '提示', '未找到“立体声混音”，系统不支持或功能未开启');
  } else {
    startAudioCapture();
  }
}

  
  async function startAudioCapture() {
    const selectedDeviceId = audioDevicesSelect.value;
    console.log(audioDevicesSelect.value);
    const constraints = {
      audio: {
        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
      }
    };
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048; // Set FFT size (frequency bin resolution)
      dataArray = new Uint8Array(analyser.frequencyBinCount);
  
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
  
      visualizeAudio();
    } catch (error) {
      console.error('Error capturing audio:', error);
    }
  }

  function visualizeAudio() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
  
    const shadowOffsetX = 0;
    const shadowOffsetY = 0;
    const shadowBlur = 30;
  
    let lastDrawTime = 0; // 上次绘制的时间戳
    // const fps = window.settingsAPI.settingsGet('visualAudioFPS'); // 限制帧率
    const fps = window.parent.getVisualAudioFPS();
    console.log('fps:' + fps);
    const frameInterval = 1000 / fps; // 每帧的间隔时间
  
    function draw(timestamp) {
      // 计算与上次绘制的时间间隔
      const delta = timestamp - lastDrawTime;
  
      if (delta >= frameInterval) {
        lastDrawTime = timestamp; // 更新上次绘制时间
  
        analyser.getByteFrequencyData(dataArray);
  
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  
        const barWidth = (WIDTH / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
  
        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i] / 2;
          const fillColor = "101, 68, 235";
          canvasCtx.shadowOffsetX = shadowOffsetX;
          canvasCtx.shadowOffsetY = shadowOffsetY;
          canvasCtx.shadowBlur = shadowBlur;
          canvasCtx.shadowColor = `rgb(${fillColor})`;
          canvasCtx.fillStyle = `rgba(${fillColor},${barHeight / 128 + 0.3})`;
          canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
          x += barWidth + 1;
        }
      }
  
      requestAnimationFrame(draw); // 请求下一帧
    }
  
    requestAnimationFrame(draw); // 启动动画循环
  }
  

getAudioDevices();