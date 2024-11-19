const Store = require('electron-store');


// 定义默认设置
const defaultSettings = {
  autoLaunch: false, // 是否开机自启
  wallpaperType: 'bilibili', //img video url bilibili
  wallpaperPath: 'BV1m34y1M7pG' // 自定义壁纸路径
};

// 初始化 store 实例
const store = new Store({ defaults: defaultSettings });

const storeManager = {
  /**
   * 获取某个设置项的值
   * @param {string} key - 设置项的键
   * @returns {*} - 返回对应的值
   */
  get(key) {
    return store.get(key);
  },

  /**
   * 设置某个设置项的值
   * @param {string} key - 设置项的键
   * @param {*} value - 要设置的值
   */
  set(key, value) {
    store.set(key, value);
  },

  /**
   * 重置某个设置项到默认值
   * @param {string} key - 设置项的键
   */
  reset(key) {
    if (defaultSettings.hasOwnProperty(key)) {
      store.set(key, defaultSettings[key]);
    } else {
      console.warn(`Key "${key}" 不在默认设置中，无法重置。`);
    }
  },

  /**
   * 重置所有设置项到默认值
   */
  resetAll() {
    store.clear();
    store.set(defaultSettings);
  },

  /**
   * 检查某个设置项是否存在
   * @param {string} key - 设置项的键
   * @returns {boolean} - 是否存在
   */
  has(key) {
    return store.has(key);
  },

  /**
   * 获取所有设置项
   * @returns {object} - 返回所有设置项的对象
   */
  getAll() {
    return store.store;
  },
};

module.exports = {
  storeManager
};
