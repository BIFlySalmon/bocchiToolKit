const canvas = document.getElementById('glowCanvas');
    const ctx = canvas.getContext('2d');
    const toggleTop = document.getElementById('toggleTop');
    const toggleBottom = document.getElementById('toggleBottom');
    const toggleLeft = document.getElementById('toggleLeft');
    const toggleRight = document.getElementById('toggleRight');
    const audioFile = document.getElementById('audioFile');
    const uploadButton = document.getElementById('uploadButton');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let audioContext, analyser, dataArray, source;
    let isPlaying = false;

    // 初始化音频和频谱分析器
    function setupAudio(file) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.loop = true;
      audio.play();

      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;  // 设置fftSize
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      isPlaying = true;
      draw();
    }

    // 频谱数据处理函数
    function processFrequencyData(data) {
      const usableFrequencyCount = Math.floor(data.length * 0.7); // 截取前 70%
      let processedData = data.slice(0, usableFrequencyCount);   // 截取数据
      processedData = smoothData(processedData, 1);             // 平滑处理
      processedData = mapToLogScale(processedData);             // 对数缩放
      processedData = enhanceDynamicRange(processedData, 1.2);  // 动态范围增强
      processedData = fillMissingData(processedData);           // 填充高频数据
      return processedData;
    }

    // 平滑处理（移动平均滤波）
    function smoothData(data, smoothingFactor = 3) {
      const smoothed = [];
      for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        for (let j = -smoothingFactor; j <= smoothingFactor; j++) {
          const index = i + j;
          if (index >= 0 && index < data.length) {
            sum += data[index];
            count++;
          }
        }
        smoothed.push(sum / count);
      }
      return smoothed;
    }

    // 对数缩放
    function mapToLogScale(data) {
      return data.map((value, index) => {
        const logIndex = Math.log2(1 + index); // 使用 log2 映射
        return value * logIndex;
      });
    }

    // 动态范围增强
    function enhanceDynamicRange(data, factor = 1.5) {
      return data.map((value) => Math.pow(value / 255, factor) * 80);
    }

    // 填充缺失频率（右侧为零的部分）
    function fillMissingData(data) {
      const filledData = [...data];
      const lastNonZero = filledData.findLastIndex((value) => value > 0);

      // 从最后一个非零值开始填充
      for (let i = lastNonZero + 1; i < filledData.length; i++) {
        filledData[i] = filledData[lastNonZero] * 0.7; // 用较小的值填充
      }

      return filledData;
    }

// 绘制频谱响应效果
function draw() {
  if (!isPlaying) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  analyser.getByteFrequencyData(dataArray);
  const processedData = processFrequencyData(dataArray);

  const width = canvas.width;
  const height = canvas.height;
  const barWidth = width / processedData.length;
  const maxBarHeight = 50;

  // 设置阴影效果的属性
  const shadowOffsetX = 0;
  const shadowOffsetY = 0;
  const shadowBlur = 30;

  // Top glow
  if (toggleTop.checked) {
    ctx.save();
    const fillColor = 'rgba(255, 0, 0, 1)';
    ctx.fillStyle = fillColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = fillColor;  // 设置阴影颜色与矩形条的颜色相同
    for (let i = 0; i < processedData.length; i++) {
      const barHeight = (processedData[i] / 255) * maxBarHeight;
      ctx.fillRect(i * barWidth, 0, barWidth, barHeight);
    }
    ctx.restore();
  }

  // Bottom glow
  if (toggleBottom.checked) {
    ctx.save();
    const fillColor = 'rgba(255, 255, 0, 1)';
    ctx.fillStyle = fillColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = fillColor;  // 设置阴影颜色与矩形条的颜色相同
    for (let i = 0; i < processedData.length; i++) {
      const barHeight = (processedData[i] / 255) * maxBarHeight;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
    ctx.restore();
  }

  // Left glow
  if (toggleLeft.checked) {
    ctx.save();
    const fillColor = 'rgba(0, 0, 255, 1)';
    ctx.fillStyle = fillColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = fillColor;  // 设置阴影颜色与矩形条的颜色相同
    for (let i = 0; i < processedData.length; i++) {
      const barHeight = (processedData[i] / 255) * maxBarHeight;
      ctx.fillRect(0, i * (height / processedData.length), barHeight, height / processedData.length);
    }
    ctx.restore();
  }

  // Right glow
  if (toggleRight.checked) {
    ctx.save();
    const fillColor = 'rgba(0, 255, 0, 1)';
    ctx.fillStyle = fillColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = fillColor;  // 设置阴影颜色与矩形条的颜色相同
    for (let i = 0; i < processedData.length; i++) {
      const barHeight = (processedData[i] / 255) * maxBarHeight;
      ctx.fillRect(width - barHeight, i * (height / processedData.length), barHeight, height / processedData.length);
    }
    ctx.restore();
  }

  requestAnimationFrame(draw);
}



    // 点击按钮时触发文件选择器
    uploadButton.addEventListener('click', () => {
        audioFile.click();
    });

    audioFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
        if (isPlaying && audioContext) {
            audioContext.close();
        }
        setupAudio(file);
        }
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });