// detect.js - browser & os detection
// 2011 (c) Ben Brooks Scholz. MIT Licensed.

;(function (window) {

    var browser,
        version,
        mobile,
        os,
        osversion,
        bit,
        ua = window.navigator.userAgent,
        platform = window.navigator.platform;

    if ( /MSIE/.test(ua) ) {
        
        browser = 'Internet Explorer';
        
        if ( /IEMobile/.test(ua) ) {
            mobile = 1;
        }
        
        version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
        
    } else if ( /Chrome/.test(ua) ) {
        // Platform override for Chromebooks
        if ( /CrOS/.test(ua) ) {
            platform = 'CrOS';
        }

        browser = 'Chrome';
        version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
        
    } else if ( /Opera/.test(ua) ) {
        
        browser = 'Opera';
        
        if ( /mini/.test(ua) || /Mobile/.test(ua) ) {
            mobile = 1;
        }
        
    } else if ( /Android/.test(ua) ) {
        
        browser = 'Android Webkit Browser';
        mobile = 1;
        os = /Android\s[\.\d]+/.exec(ua)[0];
        
    } else if ( /Firefox/.test(ua) ) {
        
        browser = 'Firefox';
        
        if ( /Fennec/.test(ua) ) {
            mobile = 1;
        }
        version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
        
    } else if ( /Safari/.test(ua) ) {
        
        browser = 'Safari';
        
        if ( (/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua)) ) {
            os = 'iOS';
            mobile = 1;
        }
        
    }

    if ( !version ) {
        
         version = /Version\/[\.\d]+/.exec(ua);
         
         if (version) {
             version = version[0].split('/')[1];
         } else {
             version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
         }
         
    }
    
    if ( platform === 'MacIntel' || platform === 'MacPPC' ) {
        os = 'Mac OS X';
        osversion = /10[\.\_\d]+/.exec(ua)[0];
        if ( /[\_]/.test(osversion) ) {
            osversion = osversion.split('_').join('.');
        }
    } else if ( platform === 'CrOS' ) {
        os = 'ChromeOS';
    } else if ( platform === 'Win32' || platform == 'Win64' ) {
        os = 'Windows';
        bit = platform.replace(/[^0-9]+/,'');
    } else if ( !os && /Android/.test(ua) ) {
        os = 'Android';
    } else if ( !os && /Linux/.test(platform) ) {
        os = 'Linux';
    } else if ( !os && /Windows/.test(ua) ) {
        os = 'Windows';
    }

    window.ui = {
        browser : browser,
        version : version,
        mobile : mobile,
        os : os,
        osversion : osversion,
        bit: bit
    };
}(this));
/**
 * @module Browser-check
 *
 * @require detect.js
 *
 * Name of detected browser could be found here:
 *     window.ui.browser
 * Possible variants:
 *     - Internet Explorer
 *     - Chrome
 *     - Opera
 *     - Android Webkit Browser
 *     - Firefox
 *     - Safari
 * 
 */
var badbrowser = (function (window, document, undefined) {
    'use strict'

    var ui = window.ui,
        api = {},
        settings = {},
        browsers,
        defaultBodyOverflow,
        defaults,
        defaultTemplate;

    defaultTemplate = [
        "<h1>Your browser is not supported</h1>",
        "<p>You can continue browsing, but correct work is not guaranteed</p>",
        "<p>",
        "<a class='oldbrowser__browserLink' title='Download Google Chrome' style='background-position: 0px 0px;' href='https://www.google.com/chrome/' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Mozilla Firefox' style='background-position: -60px 0px;' href='https://www.mozilla.org/ru/firefox/new/' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Opera' style='background-position: -120px 0px;' href='http://www.opera.com/download' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Safari' style='background-position: -180px 0px;' href='https://www.apple.com/safari/' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Internet Explorer' style='background-position: -240px 0px;' href='https://www.microsoft.com/ie/' target='_blank'></a>",
        "</p>",
        "<a href='#' class='badbrowser-close'>Close</a>"
    ].join("");

    // Dictionary to translate detect.js browser's name 
    // into badbrowser's settings shortcut 
    browsers = {
        'Internet Explorer': 'ie',
        'Chrome': 'chrome',
        'Opera': 'opera',
        'Android Webkit Browser': 'android',
        'Firefox': 'firefox',
        'Safari': 'safari'
    };

    defaults = {
        lang: 'en',
        template: null,
        path: '/alerts/',
        supported: {
            chrome: 40,
            firefox: 34,
            ie: 9,
            opera: 26,
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
    function init (options) {
        var isMatch,
            name,
            isMobile = ui.mobile;
        
        settings = extend(settings, defaults);
        settings = extend(settings, options);
        isMatch = check();

        if (!isMatch) {
            name = settings.lang;
            if (isMobile) name += '.mobile';
            getTemplate(name, function (text) {
                settings.template = text || defaultTemplate;
                toggleWarning();
            })
        }
    };


    /**
     * Check if current browser is supported
     * @return {Boolean} 
     */
    function check () {
        var currentBrowser = browsers[ui.browser],
            minSupported = settings.supported[currentBrowser],
            isMobileSupported = settings.supported.mobile === true;

        if (minSupported === 'not supported' || (ui.mobile && !isMobileSupported))
            return false
        else 
            return parseFloat(minSupported) <= parseFloat(ui.version );
    }

    /**
     * Merge defaults with user options
     * 
     * @param  {Object} defaults 
     * @param  {Object} options  
     * @return {Object}
     */
    function extend (extended, options) {
        for (var property in options) {
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
    };


    /**
     * Shows warning if it is not added yet and removes
     * warning if it exists
     */
    function toggleWarning (value) {
        var body, warning, warningHelper, warningContent, isPass;
        
        body = document.getElementsByTagName('body')[0];
        warning = body.querySelectorAll('.badbrowser'); 

        isPass = getCookie('badbrowser_pass');
        console.log('isPass?', isPass);

        if (isPass)
            return;

        // Remove warning if it's exists
        if (warning.length != 0) {
            body.removeChild(warning[0]);
            body.style.overflow = defaultBodyOverflow;
        } else {
            defaultBodyOverflow = body.style.overflow;
            body.style.overflow = 'hidden';

            warning = document.createElement('div');
            warning.className = 'badbrowser';

            warningHelper = document.createElement('div');
            warningHelper.className = 'badbrowser__helper';

            warningContent = document.createElement('div');
            warningContent.className = 'badbrowser__content';

            warning.appendChild(warningHelper);
            warning.appendChild(warningContent);
            warningContent.innerHTML = settings.template;

            var close = warning.querySelectorAll('.badbrowser-close')[0];
            if (close.addEventListener)
                close.addEventListener('click', closeWarning);
            else 
                close.attachEvent('onclick', closeWarning);

            body.appendChild(warning);
        }
    }

    function closeWarning () {
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (30 * 24 * 60 * 60 * 1000))
        toggleWarning(false);

        document.cookie = "badbrowser_pass=true;" + "expires=" + expireDate.toUTCString();
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }


    /**
     * Cross-browser XMLHttpRequest
     * 
     * @return {XMLHttpRequest}
     */
    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
              xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
              xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }

    /**
     * Get template for warning winow
     * 
     * @param  {String} lang - eg. 'en', 'ru'
     * @param  {Function(text)} callback - text of loaded template
     */
    function getTemplate (name, callback) {
        var request = getXmlHttp();
        if (request) {
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    request.status == 200 
                        ? callback(request.responseText)
                        : callback(null);
                }
            }
            request.open('GET', settings.path + name + '.html', true);
            request.send(null);
        };
    }
})(window, document);