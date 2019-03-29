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
    resizableAreaStyle: options.resizableAreaStyle || {}
  });
};

module.exports = {
  save: function (options, callback) {
    const styles = getOverrideStyles(options);
    
    const frame = ScreenShotFrame.getFrame(options, (updatedOptions) => {
      const format = (options.format || 'png').toLowerCase();
      updatedOptions.filename = updatedOptions.filename || 'screenshot_' + Math.round((+(new Date()) + Math.random()));
      if (formats.indexOf(format) === -1) {
        return callback && callback(new Error('invalid format ' + format));
      }
      updatedOptions.quality = typeof (updatedOptions.quality) !== 'number' ? 100 : updatedOptions.quality;
      
      if (options.onSnapStart) {
        options.onSnapStart();
      }
      
      if (!options.translateEnabled) {
        updatedOptions.frame = {
          ...updatedOptions.frame,
          x: (window.innerWidth - updatedOptions.frame.width) / 2,
          y: (window.innerHeight - updatedOptions.frame.height) / 2,
        }
      }
      
      exec(function (res) {
        callback && callback(null, res);
      }, function (error) {
        callback && callback(error);
      }, 'Screenshot', 'saveScreenshot', [updatedOptions]);
    });
    frame.showScreenShotModal(styles);
    
    return frame;
  },
  
  getBase64: function (options, callback) {
    const styles = getOverrideStyles(options);
    
    const frame = ScreenShotFrame.getFrame(options, (updatedOptions) => {
      updatedOptions.quality = typeof (updatedOptions.quality) !== 'number' ? 100 : updatedOptions.quality;
      
      if (options.onSnapStart) {
        options.onSnapStart();
      }
      
      if (!options.translateEnabled) {
        updatedOptions.frame = {
          ...updatedOptions.frame,
          x: (window.innerWidth - updatedOptions.frame.width) / 2,
          y: (window.innerHeight - updatedOptions.frame.height) / 2,
        }
      }
      
      exec(function (res) {
        callback && callback(null, res);
      }, function (error) {
        callback && callback(error);
      }, 'Screenshot', 'getScreenshotAsURI', [updatedOptions]);
    });
    
    frame.showScreenShotModal(styles);
    return frame;
  }
};
