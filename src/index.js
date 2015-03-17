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