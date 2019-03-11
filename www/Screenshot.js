/*
 *  MIT licensed
 */
const exec = require('cordova/exec');
const ScreenShotFrame = require('./ScreenShotFrame');
const formats = ['png', 'jpg'];

module.exports = {
  getFrame: function (options, callback) {
    return ScreenShotFrame.getFrame((updatedOptions) => {
      this.save(callback, updatedOptions);
    }, options || {}).showScreenShotModal();
  },
  
  save: function (callback, options) {
    const format = (options.format || 'png').toLowerCase();
    options.filename = options.filename || 'screenshot_' + Math.round((+(new Date()) + Math.random()));
    if (formats.indexOf(format) === -1) {
      return callback && callback(new Error('invalid format ' + format));
    }
    options.quality = typeof (options.quality) !== 'number' ? 100 : options.quality;
    exec(function (res) {
      callback && callback(null, res);
    }, function (error) {
      callback && callback(error);
    }, 'Screenshot', 'saveScreenshot', [options]);
  },
  
  URI: function (callback, options) {
    options.quality = typeof (options.quality) !== 'number' ? 100 : options.quality;
    exec(function (res) {
      callback && callback(null, res);
    }, function (error) {
      callback && callback(error);
    }, 'Screenshot', 'getScreenshotAsURI', [options]);
  },
};
