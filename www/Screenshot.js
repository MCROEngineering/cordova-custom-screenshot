/*
 *  MIT licensed
 */
const cordova = require('cordova');
const exec = require('cordova/exec');
const ScreenShotFrame  = require('./ScreenShotFrame');
const formats = ['png','jpg'];

// module.exports = {
//   getFrame: function() {
//     return ScreenShotFrame.apply(this, arguments);
//   },
//
//   save:function(callback, options) {
//     var format = (options.format || 'png').toLowerCase();
//     options.filename = options.filename || 'screenshot_'+Math.round((+(new Date()) + Math.random()));
//     if(formats.indexOf(format) === -1){
//       return callback && callback(new Error('invalid format '+format));
//     }
//     options.quality = typeof(options.quality) !== 'number'?100:options.quality;
//     exec(function(res){
//       callback && callback(null,res);
//     }, function(error){
//       callback && callback(error);
//     }, "Screenshot", "saveScreenshot", [options]);
//   },
//
//   URI:function(callback, options){
//     options.quality = typeof(options.quality) !== 'number'?100:options.quality;
//     exec(function(res){
//       callback && callback(null, res);
//     }, function(error){
//       callback && callback(error);
//     }, "Screenshot", "getScreenshotAsURI", [options]);
//
//   }
// };

// Empty constructor
function Screenshot() {}

Screenshot.prototype.getFrame = function() {
  return ScreenShotFrame.apply(this, arguments);
};

Screenshot.prototype.save = function(callback, options) {
  var format = (options.format || 'png').toLowerCase();
  options.filename = options.filename || 'screenshot_'+Math.round((+(new Date()) + Math.random()));
  if(formats.indexOf(format) === -1){
    return callback && callback(new Error('invalid format '+format));
  }
  options.quality = typeof(options.quality) !== 'number'?100:options.quality;
  exec(function(res){
    callback && callback(null,res);
  }, function(error){
    callback && callback(error);
  }, "Screenshot", "saveScreenshot", [options]);
};

Screenshot.prototype.URI = function(callback, options){
  options.quality = typeof(options.quality) !== 'number'?100:options.quality;
  exec(function(res){
    callback && callback(null, res);
  }, function(error){
    callback && callback(error);
  }, "Screenshot", "getScreenshotAsURI", [options]);

};

Screenshot.install = function() {
  if (!window.plugins) {
    window.plugins = {};
  }
  window.plugins.toastyPlugin = new Screenshot();
  return window.plugins.toastyPlugin;
};
cordova.addConstructor(Screenshot.install);
