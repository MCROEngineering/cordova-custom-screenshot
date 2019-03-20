/*
 *  MIT licensed
 */
const exec = require('cordova/exec');
const ScreenShotFrame = require('./ScreenShotFrame');
const formats = ['png', 'jpg'];

const getOverrideStyles = function (options) {
  return ({
    modalStyle: options.modalStyle || {},
    snapStyle: options.snapStyle || {},
    closeLinkStyle: options.closeLinkStyle || {},
    resizeCornersStyle: options.resizeCornersStyle || {},
  });
};

module.exports = {
  save: function (options, callback) {
    const styles = getOverrideStyles(options);

    return ScreenShotFrame.getFrame(options, (updatedOptions) => {
      const format = (options.format || 'png').toLowerCase();
      updatedOptions.filename = updatedOptions.filename || 'screenshot_' + Math.round((+(new Date()) + Math.random()));
      if (formats.indexOf(format) === -1) {
        return callback && callback(new Error('invalid format ' + format));
      }
      updatedOptions.quality = typeof (updatedOptions.quality) !== 'number' ? 100 : updatedOptions.quality;

      if (options.onSnapStart) {
        options.onSnapStart();
      }

      exec(function (res) {
        callback && callback(null, res);
      }, function (error) {
        callback && callback(error);
      }, 'Screenshot', 'saveScreenshot', [updatedOptions]);
    }).showScreenShotModal(styles);
  },

  getBase64: function (options, callback) {
    const styles = getOverrideStyles(options);

    return ScreenShotFrame.getFrame(options, (updatedOptions) => {
      updatedOptions.quality = typeof (updatedOptions.quality) !== 'number' ? 100 : updatedOptions.quality;

      if (options.onSnapStart) {
        options.onSnapStart();
      }

      exec(function (res) {
        callback && callback(null, res);
      }, function (error) {
        callback && callback(error);
      }, 'Screenshot', 'getScreenshotAsURI', [updatedOptions]);
    }).showScreenShotModal(styles);
  }
};
