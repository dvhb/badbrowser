import bowser from 'bowser';

export default class BadBrowser {
  constructor({
    userAgent,
    supported = {},
    unsupported = {},
    ignoreChoice = false,
    fullscreen = true,
    logo = false,
    path = false,
  } = {}) {
    this._userAgent = userAgent || navigator.userAgent;
    this._bowser = bowser;
    this.detectedBrowser = bowser._detect(this._userAgent);

    this.settings = extend(
      {
        template: null,
        path: false,
        fullscreen: true,
        ignoreChoice: false,
        logo: false,
        supported: {
          chrome: '42',
          chromium: '42',
          firefox: '38',
          msie: '9',
          msedge: '12',
          opera: '26',
          safari: '6',
          yandexbrowser: '15',
          safari_mobile: '7',
          android: '4',
          mobile: true,
        },
      },
      { supported, unsupported, ignoreChoice, fullscreen, logo, path },
    );

    this.defaultTemplate = `
      <style>
        .badbrowser {
          background: #fff;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-align: center;
          white-space: nowrap;
          overflow: auto
        }
        
        .badbrowser_modal {
          background: rgba(0, 0, 0, .25)
        }
        
        .badbrowser_modal .badbrowser__content {
          border: 1px solid #ccc;
          border-radius: 3px;
          background: #fff;
          padding: 15px
        }
        
        .badbrowser__logo {
          width: 50%
        }
        
        .badbrowser__content,
        .badbrowser__helper {
          display: inline-block;
          vertical-align: middle
        }
        
        .badbrowser__helper {
          height: 100%;
          margin-right: -.25em
        }
        
        .badbrowser__content {
          white-space: normal
        }
        
        .oldbrowser__browserLink {
          display: inline-block;
          width: 60px;
          height: 66px;
          margin: 0 10px;
          background: none;
        }
        
        .oldbrowser__browserLink img {
          display: block;
          max-width: 100%;
        }
      </style>
      <img class="badbrowser__logo" src=""/>
      <h1>Your browser is not supported</h1>
      <h3 class="badbrowser-user-browser"></h3>
      <p>You can continue browsing, but correct work is not guaranteed</p>
      <p>
        <a class="oldbrowser__browserLink" title="Download Google Chrome" href="https://www.google.com/chrome/" target="_blank">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/chrome/chrome_64x64.png" alt="Google Chrome">
        </a>
        <a class="oldbrowser__browserLink" title="Download Mozilla Firefox" href="https://www.mozilla.org/en-US/firefox/" target="_blank">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/firefox/firefox_64x64.png" alt="Mozilla Firefox">
        </a>
        <a class="oldbrowser__browserLink" title="Download Opera" href="http://www.opera.com/download" target="_blank">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/opera/opera_64x64.png" alt="Opera">
        </a>
        <a class="oldbrowser__browserLink" title="Download Safari" href="https://www.apple.com/safari/" target="_blank">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/safari/safari_64x64.png" alt="Safari">
        </a>
        <a class="oldbrowser__browserLink" title="Download Internet Explorer" href="https://support.microsoft.com/en-us/help/17621/" target="_blank">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/archive/internet-explorer_9-11/internet-explorer_9-11_64x64.png" alt="Internet Explorer">
        </a>
      </p>
      <a href="javascript:;" class="badbrowser-close">Continue</a>
    `;

    if (this.settings.unsupported) {
      for (let key in this.settings.unsupported) {
        if (typeof this.settings.unsupported[key] == 'string' || typeof this.settings.unsupported[key] == 'number') {
          this.settings.supported[key] = (parseInt(this.settings.unsupported[key]) + 1).toString();
        } else {
          this.settings.supported[key] = !this.settings.unsupported[key];
        }
      }
    }

    const isMatch = this.check();

    if (!isMatch) {
      if (!this.settings.path) {
        this.settings.template = this.defaultTemplate;
        this.toggleWarning();
      } else {
        if (typeof this.settings.path == 'function') {
          path = this.settings.path();
        } else if (typeof this.settings.path == 'string') {
          path = this.settings.path;
        }
        this.getTemplate(path, text => {
          this.settings.template = text || this.defaultTemplate;
          this.toggleWarning();
        });
      }
    }
  }

  get userAgent() {
    return this._userAgent;
  }

  /**
   * Browser name
   *
   * @returns {string}
   */
  get name() {
    return `${this.detectedBrowser.name}${this.detectedBrowser.mobile ? ' Mobile' : ''}`;
  }

  get version() {
    return parseFloat(this.detectedBrowser.version);
  }

  get minSupportVersion() {
    return this.minVersions[this.currentFlag];
  }

  get currentFlag() {
    function intersection(o1, o2) {
      return Object.keys(o1).filter({}.hasOwnProperty.bind(o2));
    }

    if (!this._currentFlag) {
      const flags = intersection(this.settings.supported, this.detectedBrowser);
      const [browser, isMobile] = flags;

      const mobileBrowser = `${browser}_${isMobile}`;
      if (isMobile && this.settings.supported[mobileBrowser]) {
        this._currentFlag = mobileBrowser;
      } else {
        this._currentFlag = browser;
      }
    }
    return this._currentFlag;
  }

  get minVersions() {
    return { [this.currentFlag]: this.settings.supported[this.currentFlag] };
  }

  /**
   * For old versions support. Like badbrowser.init() instead new badbrowser()
   *
   * @returns {BadBrowser}
   */
  static init(options) {
    return new BadBrowser(options);
  }

  /**
   * Check if current browser is supported
   *
   * @return {Boolean}
   */
  check() {
    if (this.detectedBrowser.mobile && !this.settings.supported.mobile) return false;

    let isSupported = false;
    try {
      const bowserMinVersions = { [this.currentFlag.replace('_mobile', '')]: this.minSupportVersion };
      isSupported = this._bowser.check(bowserMinVersions, this.userAgent);
    } catch (e) {
      isSupported = false;
    }

    return isSupported;
  }

  /**
   * Shows warning if it is not added yet and removes warning if it exists
   */
  toggleWarning() {
    let isPass = this.getCookie('badbrowser_pass');
    if (isPass) return;

    let warningHelper, warningContent;
    let body = document.getElementsByTagName('body')[0];
    let warning = body.querySelectorAll('.badbrowser');
    const _this = this;

    // Remove warning if it's exists
    if (warning.length !== 0) {
      body.removeChild(warning[0]);
      body.style.overflow = this._defaultBodyOverflow;
    } else {
      this._defaultBodyOverflow = body.style.overflow;
      body.style.overflow = 'hidden';

      warning = document.createElement('div');
      warning.className = 'badbrowser';
      if (!this.settings.fullscreen) {
        warning.className += ' badbrowser_modal';
        if (warning.addEventListener)
          warning.addEventListener('click', function(e) {
            _this.closeWarning(e, this);
          });
        else
          warning.attachEvent('onclick', function(e) {
            _this.closeWarning(e, this);
          });
      }

      warningHelper = document.createElement('div');
      warningHelper.className = 'badbrowser__helper';

      warningContent = document.createElement('div');
      warningContent.className = 'badbrowser__content';

      warning.appendChild(warningHelper);
      warning.appendChild(warningContent);
      warningContent.innerHTML = this.settings.template;

      let logos = warning.querySelectorAll('.badbrowser__logo');
      for (let i = logos.length - 1; i >= 0; i--) {
        if (!this.settings.logo) logos[i].parentNode.removeChild(logos[i]);
        else logos[i].src = this.settings.logo;
      }

      this.showCurrentVersion(warningContent);

      let closeBtns = warning.querySelectorAll('.badbrowser-close');
      for (let i = closeBtns.length - 1; i >= 0; i--) {
        let close = closeBtns[i];
        if (close && close.addEventListener)
          close.addEventListener('click', function(e) {
            _this.closeWarning(e, this);
          });
        else if (close && close.attachEvent)
          close.attachEvent('onclick', function(e) {
            _this.closeWarning(e, this);
          });
      }

      body.appendChild(warning);
    }
  }

  closeWarning(event, _this) {
    if (event.target !== _this) return;

    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    this.toggleWarning();

    document.cookie = 'badbrowser_pass=true;' + 'expires=' + expireDate.toUTCString();
  }

  showCurrentVersion(element) {
    let browserEl = element.querySelector('.badbrowser-user-browser');

    if (browserEl) {
      browserEl.innerHTML = `${this.name} ${this.version}`;
    }
  }

  getCookie(name) {
    if (this.settings.ignoreChoice) return;
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length == 2)
      return parts
        .pop()
        .split(';')
        .shift();
  }

  /**
   * Cross-browser XMLHttpRequest
   *
   * @return {XMLHttpRequest}
   */
  getXmlHttp() {
    let xmlhttp;
    try {
      xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (err) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
      xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
  }

  /**
   * Get template for warning window
   *
   * @param  {String} path - path to badbrowser template
   * @param  {Function(text)} callback - text of loaded template
   */
  getTemplate(path, callback) {
    if (!path) {
      callback(null);
      return;
    }
    let request = this.getXmlHttp();
    if (request) {
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          request.status == 200 ? callback(request.responseText) : callback(null);
        }
      };
      request.open('GET', path, true);
      request.send(null);
    }
  }
}

/**
 * Merge defaults with user options
 *
 * @param  {Object} defaults
 * @param  {Object} options
 * @return {Object}
 */
function extend(extended, options) {
  for (let property in options) {
    try {
      if (options[property].constructor == Object) {
        extended[property] = extend(extended[property], options[property]);
      } else {
        extended[property] = options[property];
      }
    } catch (ex) {
      extended[property] = options[property];
    }
  }

  return extended;
}
