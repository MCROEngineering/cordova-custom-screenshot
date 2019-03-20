var isOpen = false;

module.exports = {
  getFrame: function (options, callback) {
    if (isOpen) {
      return;
    }
    isOpen = true;

    if (!options || typeof options !== 'object') {
      console.error('Plugin: options needs to be an object of type {width, height, x, y} and it is mandatory');
    }
    const width = options.width || 200;
    const height = options.height || 200;
    const fileName = options.fileName || 'screenshotName' + parseInt(Math.random() * 1000, 10);

    const modalId = 'screenshot-modal';
    const widthFrame = width;
    const heightFrame = height;
    const quality = options.quality || 100;
    const resizeEnabled = options.resizeEnabled;
    const translateEnabled = options.translateEnabled;

    let xOffset = options.x || 50;
    let yOffset = options.y || 50;

    return {
      showScreenShotModal: function (styles) {
        const modalStyle = Object.assign({
          position: 'absolute',
          backgroundColor: '#000000',
          opacity: '0.7',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }, styles.modalStyle || {});
        const closeLinkStyle = Object.assign({
          position: 'absolute',
          color: '#fff',
          top: '20px',
          right: '20px',
          fontSize: '16px',
          cursor: 'pointer',
        }, styles.closeLinkStyle || {});
        const resizableAreaStyle = Object.assign({
          position: 'relative',
          display: 'flex',
          width: `${widthFrame}px`,
          height: `${heightFrame}px`,
          backgroundColor: '#fff',
          transform: `translate3d(${xOffset}px, ${yOffset}px, 0)`,
        }, styles.resizableAreaStyle || {});
        const snapButtonStyle = Object.assign({
          position: 'relative',
          display: 'block',
          padding: '5px 20px',
          margin: 'auto',
          backgroundColor: '#414141',
          color: '#fff',
          borderRadius: '10px',
          cursor: 'pointer',
          textAlign: 'center',
          fontSize: '20px',
        }, styles.snapStyle || {});

        const modalElement = document.createElement('div');
        const closeLink = document.createElement('a');
        const resizableArea = document.createElement('div');

        const topLeft = document.createElement('div');
        topLeft.style.cssText = 'background-color: #ff0; position: absolute; height: 10%; width: 10%; top: 0; left: 0;';
        const topRight = document.createElement('div');
        topRight.style.cssText = 'background-color: #ff0; position: absolute; height: 10%; width: 10%; top: 0; right: 0;';
        const bottomLeft = document.createElement('div');
        bottomLeft.style.cssText = 'background-color: #ff0; position: absolute; height: 10%; width: 10%; bottom: 0; left: 0;';
        const bottomRight = document.createElement('div');
        bottomRight.style.cssText = 'background-color: #ff0; position: absolute; height: 10%; width: 10%; bottom: 0; right: 0;';

        const snapButton = document.createElement('span');
        snapButton.id = 'snapButtonLink';
        const snapButtonText = document.createTextNode(styles.snapStyle ? styles.snapStyle.text || 'Take a Snap' : 'Take a Snap');

        snapButton.appendChild(snapButtonText);
        Object.keys(snapButtonStyle).forEach(function (prop) {
          snapButton.style[prop] = snapButtonStyle[prop];
        });

        modalElement.id = modalId;

        Object.keys(modalStyle).forEach(function (prop) {
          modalElement.style[prop] = modalStyle[prop];
        });

        closeLink.appendChild(document.createTextNode(styles.closeStyle ? styles.closeStyle.text || 'X' : 'X'));
        Object.keys(closeLinkStyle).forEach(function (prop) {
          closeLink.style[prop] = closeLinkStyle[prop];
        });

        Object.keys(resizableAreaStyle).forEach(function (prop) {
          resizableArea.style[prop] = resizableAreaStyle[prop];
        });


        closeLink.onclick = this.closeScreenShotModal.bind(this);
        modalElement.onclick = this.closeScreenShotModal.bind(this);
        snapButton.onclick = this.takeASnap.bind(this);


        // add events for resizable area
        resizableArea.addEventListener('touchstart', this.handleResizableStart.bind(this), false);
        resizableArea.addEventListener('touchend', this.handleResizableEnd.bind(this), false);
        resizableArea.addEventListener('touchcancel', this.handleResizableCancel.bind(this), false);
        resizableArea.addEventListener('touchleave', this.handleResizableEnd.bind(this), false);
        resizableArea.addEventListener('touchmove', this.handleResizableMove.bind(this), false);

        if (resizeEnabled) {
          resizableArea.appendChild(topLeft);
          resizableArea.appendChild(topRight);
          resizableArea.appendChild(bottomLeft);
          resizableArea.appendChild(bottomRight);
        }
        resizableArea.appendChild(snapButton);
        resizableArea.id = 'resizableArea';
        this.resizableArea = resizableArea;
        // add elements to dom
        modalElement.appendChild(closeLink);
        modalElement.appendChild(resizableArea);

        if (!translateEnabled) {
          modalElement.style.pointerEvents = 'none';
          snapButton.style.pointerEvents = 'all';
        }

        document.body.appendChild(modalElement);
      },
      takeASnap: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.closeScreenShotModal();
        setTimeout(function () {
          const options = {
            frame: {
              x: xOffset,
              y: yOffset,
              width: widthFrame,
              height: heightFrame
            },
            quality: quality,
            filename: fileName
          };
          callback(options);
          // shooter.save(callback, options);
        }, 0);
      },
      closeScreenShotModal: function () {
        isOpen = false;
        const modal = document.getElementById(modalId);
        if (modal instanceof HTMLElement) {
          document.body.removeChild(modal);
        }
      },
      handleResizableStart: function (e) {

        if (e.type === 'touchstart') {
          this.initialX = e.touches[0].clientX - xOffset;
          this.initialY = e.touches[0].clientY - yOffset;
        } else {
          this.initialX = e.clientX - xOffset;
          this.initialY = e.clientY - yOffset;
        }
        if (e.target.id !== 'snapButtonLink') {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      handleResizableEnd: function (e) {
        // do something on stop
      },
      handleResizableMove: function (e) {
        if (e.target.id !== 'snapButtonLink') {
          e.preventDefault();
          e.stopPropagation();
        }
        let currentX = 0,
          currentY = 0;
        if (e.type === 'touchmove') {
          currentX = e.touches[0].clientX - this.initialX;
          currentY = e.touches[0].clientY - this.initialY;
        } else {
          currentX = e.clientX - this.initialX;
          currentY = e.clientY - this.initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        // translate
        this.resizableArea.style.transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
      },
      handleResizableCancel: function (evt) {
        // do something on cancel
      },
    }

  }
};
