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
        
        settings = extend(defaults, options);
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
        var body, warning, warningHelper, warningContent;
        
        body = document.getElementsByTagName('body')[0];
        warning = body.getElementsByClassName('badbrowser'); 

        // Remove warning if it's exists
        if (warning.length != 0) {
            body.removeChild(warning[0])
        } else {
            warning = document.createElement('div');
            warning.className = 'badbrowser';

            warningHelper = document.createElement('div');
            warningHelper.className = 'badbrowser__helper';

            warningContent = document.createElement('div');
            warningContent.className = 'badbrowser__content';

            warning.appendChild(warningHelper);
            warning.appendChild(warningContent);
            warningContent.innerHTML = settings.template;

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
            request.open('GET', './alerts/' + name + '.html', true);
            request.send(null);
        };
    }
})(window, document);