import './styles';
import DetectBrowser from './detectBrowser';

let badbrowser = (function (window, document, undefined) {
  'use strict';

  let ua = new DetectBrowser(),
    api = {},
    settings = {},
    browsers,
    defaultBodyOverflow,
    defaults,
    defaultTemplate;

  defaultTemplate = [
    '<img class="badbrowser__logo" src=""/>',
    '<h1>Your browser is not supported</h1>',
    '<h3 class="badbrowser-user-browser"></h3>',
    '<p>You can continue browsing, but correct work is not guaranteed</p>',
    '<p>',
    '<a class="oldbrowser__browserLink" title="Download Google Chrome" style="background-position: 0px 0px;" href="https://www.google.com/chrome/" target="_blank"></a>',
    '<a class="oldbrowser__browserLink" title="Download Mozilla Firefox" style="background-position: -60px 0px;" href="https://www.mozilla.org/ru/firefox/new/" target="_blank"></a>',
    '<a class="oldbrowser__browserLink" title="Download Opera" style="background-position: -120px 0px;" href="http://www.opera.com/download" target="_blank"></a>',
    '<a class="oldbrowser__browserLink" title="Download Safari" style="background-position: -180px 0px;" href="https://www.apple.com/safari/" target="_blank"></a>',
    '<a class="oldbrowser__browserLink" title="Download Internet Explorer" style="background-position: -240px 0px;" href="https://www.microsoft.com/ie/" target="_blank"></a>',
    '</p>',
    '<a href="javascript:;" class="badbrowser-close">Continue</a>'
  ].join('');

  // Dictionary to translate detect.js browser's name
  // into badbrowser's settings shortcut
  browsers = {
    'IE': 'ie',
    'IE Large Screen': 'ie',
    'Chrome': 'chrome',
    'Chrome Mobile': 'chrome_mobile',
    'Opera': 'opera',
    'Opera Mini': 'opera_mini',
    'Opera Mobile': 'opera_mobile',
    'Android Webkit Browser': 'android',
    'Firefox': 'firefox',
    'Safari': 'safari',
    'Mobile Safari': 'safari_mobile'
  };

  defaults = {
    template: null,
    path: false,
    fullscreen: true,
    ignoreChoice: false,
    logo: false,
    supported: {
      chrome: 42,
      firefox: 38,
      ie: 9,
      opera: 26,
      opera_mini: 7,
      safari_mobile: 7,
      android: 10,
      safari: 6,
      mobile: true
    }
  };

  /**
   * API
   */

  api.init = init;
  api.check = check;

  return api;

  /**
   * Initialize module
   *
   * @param  {Object} options - options that will override defaults
   */
  function init(options) {

    let isMatch,
      path;

    settings = extend(settings, defaults);
    settings = extend(settings, options);

    if (settings.unsupported) {
      settings.supported = {
        mobile: true
      };
      for (let key in settings.unsupported) {
        if (typeof settings.unsupported[key] == 'string' || typeof settings.unsupported[key] == 'number') {
          settings.supported[key] = parseInt(settings.unsupported[key]) + 1;
        } else {
          settings.supported[key] = !settings.unsupported[key];
        }
      }
    }

    isMatch = check();

    if (!isMatch) {
      if (!settings.path) {
        settings.template = defaultTemplate;
        toggleWarning();
        return;
      } else {
        if (typeof settings.path == 'function') {
          path = settings.path(ua);
        } else if (typeof settings.path == 'string') {
          path = settings.path;
        }
        getTemplate(path, function (text) {
          settings.template = text || defaultTemplate;
          toggleWarning();
        });
      }
    }
  }

  /**
   * Check if current browser is supported
   * @return {Boolean}
   */
  function check() {
    let currentBrowser = browsers[ua.name],
      minSupported = settings.supported[currentBrowser],
      isMobile = ua.mobile,
      isMobileSupported = settings.supported.mobile === true;

    if (minSupported === 'not supported' || (isMobile && !isMobileSupported))
      return false;
    else if (!minSupported) {
      return true;
    } else {
      return parseFloat(minSupported) <= parseFloat(ua.version);
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

  function showCurrentVersion(element) {
    let browserEl = element.querySelector('.badbrowser-user-browser');

    if (browserEl) {
      browserEl.innerHTML = ua.name + ' ' + ua.version;
    }
  }

  /**
   * Shows warning if it is not added yet and removes
   * warning if it exists
   */
  function toggleWarning() {
    let body, warning, warningHelper, warningContent, isPass;

    body = document.getElementsByTagName('body')[0];
    warning = body.querySelectorAll('.badbrowser');

    isPass = getCookie('badbrowser_pass');

    if (isPass)
      return;

    // Remove warning if it's exists
    if (warning.length !== 0) {
      body.removeChild(warning[0]);
      body.style.overflow = defaultBodyOverflow;
    } else {
      defaultBodyOverflow = body.style.overflow;
      body.style.overflow = 'hidden';

      warning = document.createElement('div');
      warning.className = 'badbrowser';
      if (!settings.fullscreen) {
        warning.className += ' badbrowser_modal';
        if (warning.addEventListener)
          warning.addEventListener('click', closeWarning, false);
        else
          warning.attachEvent('onclick', closeWarning);
      }


      warningHelper = document.createElement('div');
      warningHelper.className = 'badbrowser__helper';

      warningContent = document.createElement('div');
      warningContent.className = 'badbrowser__content';

      warning.appendChild(warningHelper);
      warning.appendChild(warningContent);
      warningContent.innerHTML = settings.template;

      let logos = warning.querySelectorAll('.badbrowser__logo');
      for (let i = logos.length - 1; i >= 0; i--) {
        if (!settings.logo)
          logos[i].parentNode.removeChild(logos[i]);
        else
          logos[i].src = settings.logo;
      }

      showCurrentVersion(warningContent);

      let closeBtns = warning.querySelectorAll('.badbrowser-close');
      for (let i = closeBtns.length - 1; i >= 0; i--) {
        let close = closeBtns[i];
        if (close && close.addEventListener)
          close.addEventListener('click', closeWarning);
        else if (close && close.attachEvent)
          close.attachEvent('onclick', closeWarning);
      }

      body.appendChild(warning);
    }
  }

  function closeWarning(event) {
    if (event.target !== this)
      return;
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    toggleWarning();

    document.cookie = 'badbrowser_pass=true;' + 'expires=' + expireDate.toUTCString();
  }

  function getCookie(name) {
    if (settings.ignoreChoice)
      return;
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }


  /**
   * Cross-browser XMLHttpRequest
   *
   * @return {XMLHttpRequest}
   */
  function getXmlHttp() {
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
  function getTemplate(path, callback) {
    if (!path) {
      callback(null);
      return;
    }
    let request = getXmlHttp();
    if (request) {
      request.onreadystatechange = function () {
        if (request.readyState == 4) {
          request.status == 200
            ? callback(request.responseText)
            : callback(null);
        }
      };
      request.open('GET', path, true);
      request.send(null);
    }
  }
})(window, document);

module.exports = badbrowser;
