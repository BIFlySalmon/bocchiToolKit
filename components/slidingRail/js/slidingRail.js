const slider = document.getElementById('slider');
const track = document.getElementById('slider-track');

// 档位设置
const positions = [0, 50, 100]; // 百分比位置
const frameRates = [30, 45, 60];

// 获取保存的帧率值
// const savedFrameRate = window.settingsAPI.settingsGet('visualAudioFPS');

const savedFrameRate = window.parent.getVisualAudioFPS();
let initialFrameRate = savedFrameRate ? parseInt(savedFrameRate) : 30;

// 初始化默认值（默认为 savedFrameRate 或 30）
const defaultFrameRateIndex = frameRates.indexOf(initialFrameRate);
slider.style.left = `${positions[defaultFrameRateIndex]}%`;

// 状态变量
let isDragging = false;
let trackRect;

// 吸附到最近档位
function snapToClosest(position) {
  return positions.reduce((prev, curr) =>
    Math.abs(curr - position) < Math.abs(prev - position) ? curr : prev
  );
}

// 更新滑块位置
function updateSliderPosition(position) {
  slider.style.left = `${position}%`;
}

// 根据鼠标位置计算百分比
function calculatePercentage(clientX) {
  const offsetX = clientX - trackRect.left;
  return Math.max(0, Math.min(100, (offsetX / trackRect.width) * 100));
}

// 设置帧率
async function setFrameRate(percentage) {
  const snappedPosition = snapToClosest(percentage);
  updateSliderPosition(snappedPosition);
  const index = positions.indexOf(snappedPosition);
  // console.log('Selected Frame Rate:', frameRates[index]);
  parent.setVisualAudioFPS(frameRates[index]);
}
// 阻止默认拖动行为
slider.addEventListener('mousedown', (e) => {
  e.preventDefault(); // 禁止浏览器默认行为
});

track.addEventListener('mousedown', (e) => {
  e.preventDefault(); // 禁止浏览器默认行为
});

document.addEventListener('dragstart', (e) => {
    e.preventDefault(); // 禁止所有拖动行为
});

// 拖动事件
slider.addEventListener('mousedown', (e) => {
  isDragging = true;
  trackRect = track.getBoundingClientRect();
  document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const percentage = calculatePercentage(e.clientX);
  updateSliderPosition(percentage);
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;

  isDragging = false;
  document.body.style.cursor = 'default';

  const percentage = calculatePercentage(e.clientX);
  setFrameRate(percentage);
});

// 点击滑轨条事件
track.addEventListener('click', (e) => {
  trackRect = track.getBoundingClientRect();
  const percentage = calculatePercentage(e.clientX);
  setFrameRate(percentage);
});