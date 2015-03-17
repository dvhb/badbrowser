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
        api = Object.create(null),
        settings,
        browsers,
        defaults,
        defaultTemplate;

    defaultTemplate = [
        "<h1>Your browser is not supported</h1>",
        "<p>You can continue browsing, but correct work is not guaranteed</p>",
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
        supported: {
            chrome: 40,
            firefox: 34,
            ie: 9,
            opera: 26,
            android: 10,
            safari: 6
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
        var isMatch;
        settings = extend(defaults, options);
        
        if (!settings.template) {
            getTemplate(settings.lang, function (text) {
                settings.template = text || defaultTemplate;
                isMatch = check();
                if (!isMatch) {
                    toggleWarning();
                }
            })
        }
    };


    /**
     * Check if current browser is supported
     * @return {Boolean} 
     */
    function check () {
        var currentBrowser = browsers[ui.browser],
            minSupported = settings.supported[currentBrowser];

        return minSupported === 'not supported' 
            ? false 
            : parseFloat(minSupported) <= parseFloat(ui.version );
    }

    /**
     * Merge defaults with user options
     * 
     * @param  {Object} defaults 
     * @param  {Object} options  
     * @return {Object}
     */
    function extend ( defaults, options ) {
        var extended = {},
            prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    };


    /**
     * Shows warning if it is not added yet and removes
     * warning if it exists
     */
    function toggleWarning () {
        var body, warning;
        
        body = document.getElementsByTagName('body')[0];
        warning = body.getElementsByClassName('badbrowser'); 

        // Remove warning if it's exists
        if (warning.length != 0) {
            body.removeChild(warning[0])
        } else {
            warning = document.createElement('div');
            warning.className = 'badbrowser';
            warning.innerHTML = settings.template;

            var close = warning.getElementsByClassName('badbrowser-close')[0];
            if (close.addEventListener)
                close.addEventListener('click', toggleWarning);
            else 
                close.attachEvent('onclick', toggleWarning);

            body.appendChild(warning);
        }
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
    function getTemplate (locale, callback) {
        var request = getXmlHttp();
        if (request) {
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    request.status == 200 
                        ? callback(request.responseText)
                        : callback(null);
                }
            }
            request.open('GET', './alerts/' + locale + '.html', true);
            request.send(null);
        };
    }
})(window, document);