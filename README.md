Cordova Custom Screenshot
==================


The Screenshot plugin allows your application to take custom screenshots of the current screen and save them into the 
phone. You can also drag the screenshot box and setup a custom size for it using getFrame.

## How to install

install it via cordova cli

```
cordova plugin add cordova-custom-screenshot
```

notice: only jpg format is supported
in Android
## Usage
### Frame Usage

```js
navigator.screenshot.getFrame({ width: 400, height: 200, x: 50, y: 50 },  (error, res)=> {
  if (error) {
      console.error(error);
    } else {
      console.log('File path: ',res.filePath);
    }
});
```


### Simple Usage
```js
navigator.screenshot.save((error, res) => {
  if (error) {
    console.error(error);
  } else {
    console.log('File Path = ',res.filePath);
  }
});
```
take screenshot with jpg and custom quality
```js
navigator.screenshot.save((error, res) => {
  if (error) {
    console.error(error);
  } else {
    console.log('File Path =  = ',res.filePath);
  }
},'jpg',50);
```

define a filename
```js
navigator.screenshot.save((error, res) => {
  if (error) {
    console.error(error);
  } else {
    console.log('File Path = ',res.filePath); //should be path/to/myScreenshot.jpg
  }
},'jpg',50,'myScreenShot');
```

screenshot files are stored in /sdcard/Pictures for android.

take screenshot and get it as Data URI
```js
navigator.screenshot.URI((error, res) => {
  if (error) {
    console.error(error);
  } else {
    html = '<img style="width:50%;" src="'+res.URI+'">';
    document.body.innerHTML = html;
  }
},50);
```


## Known Issue
### in Android platform I receive the black image with crosswalk 
#### solution: 

add this line ``<preference name="CrosswalkAnimatable" value="true" />`` in config.xml, see [bug](https://crosswalk-project.org/jira/browse/XWALK-2233)


License
=========
MIT license
