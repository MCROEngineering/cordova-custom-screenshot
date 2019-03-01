/*
 *  MIT licensed
 */
const exec = require('cordova/exec');
const ScreenShotFrame  = require('./ScreenShotFrame');
const formats = ['png','jpg'];

module.exports = {
	getFrame: function() {
		return ScreenShotFrame.apply(this, arguments);
	},
	save:function(callback,format,quality, filename) {
		format = (format || 'png').toLowerCase();
		filename = filename || 'screenshot_'+Math.round((+(new Date()) + Math.random()));
		if(formats.indexOf(format) === -1){
			return callback && callback(new Error('invalid format '+format));
		}
		quality = typeof(quality) !== 'number'?100:quality;
		exec(function(res){
			callback && callback(null,res);
		}, function(error){
			callback && callback(error);
		}, "Screenshot", "saveScreenshot", [format, quality, filename]);
	},

	URI:function(callback, quality){
		quality = typeof(quality) !== 'number'?100:quality;
		exec(function(res){
			callback && callback(null, res);
		}, function(error){
			callback && callback(error);
		}, "Screenshot", "getScreenshotAsURI", [quality]);

	},

	URISync:function(callback,quality){
		var method = navigator.userAgent.indexOf("Android") > -1 ? "getScreenshotAsURISync" : "getScreenshotAsURI";
		quality = typeof(quality) !== 'number'?100:quality;
		exec(function(res){
			callback && callback(null,res);
		}, function(error){
			callback && callback(error);
		}, "Screenshot", method, [quality]);
	}
};
