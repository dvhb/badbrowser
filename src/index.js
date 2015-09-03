/**
 * @module Browser-check
 *
 * @require detect.js
 * 
 */
var badbrowser = (function (window, document, undefined) {
    'use strict';

    var ua = window.detect.parse(navigator.userAgent),
        api = {},
        settings = {},
        browsers,
        defaultBodyOverflow,
        defaults,
        defaultTemplate;

    defaultTemplate = [
        "<img class='badbrowser__logo'>",
        "<h1>Your browser is not supported</h1>",
        "<p>You can continue browsing, but correct work is not guaranteed</p>",
        "<p>",
        "<a class='oldbrowser__browserLink' title='Download Google Chrome' style='background-position: 0px 0px;' href='https://www.google.com/chrome/' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Mozilla Firefox' style='background-position: -60px 0px;' href='https://www.mozilla.org/ru/firefox/new/' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Opera' style='background-position: -120px 0px;' href='http://www.opera.com/download' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Safari' style='background-position: -180px 0px;' href='https://www.apple.com/safari/' target='_blank'></a>",
        "<a class='oldbrowser__browserLink' title='Download Internet Explorer' style='background-position: -240px 0px;' href='https://www.microsoft.com/ie/' target='_blank'></a>",
        "</p>",
        "<a href='javascript:;' class='badbrowser_close'>Continue</a>"
    ].join("");

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
        lang: 'en',
        template: null,
        path: '/alerts/',
        fullscreen: true,
        ignoreChoice: false,
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
    function init (options) {
        var isMatch,
            name,
            isMobile = ua.device.type == "Mobile";
        
        settings = extend(settings, defaults);
        settings = extend(settings, options);

        if (settings.unsupported) {
            for (var key in settings.unsupported) {
                if (typeof settings.unsupported[key] == "number")
                    settings.supported[key] = settings.unsupported[key] + 1;
                else
                if (typeof settings.unsupported[key] == "boolean")
                    settings.supported[key] = !settings.unsupported[key];
            }
        }

        isMatch = check();

        if (!isMatch) {
            name = settings.lang;
            if (isMobile) name += '.mobile';
            getTemplate(name, function (text) {
                settings.template = text || defaultTemplate;
                toggleWarning();
            });
        }
    }


    /**
     * Check if current browser is supported
     * @return {Boolean} 
     */
    function check () {
        var currentBrowser = browsers[ua.browser.family],
            minSupported = settings.supported[currentBrowser],
            isMobile = ua.device.type == "Mobile",
            isMobileSupported = settings.supported.mobile === true;

        if (minSupported === 'not supported' || (isMobile && !isMobileSupported))
            return false;
        else 
            return parseFloat(minSupported) <= parseFloat(ua.browser.version );
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
    }

    function showCurrentVersion (element) {        
        var browserEl = element.getElementsByClassName("badbrowser-user-browser")[0];

        if (browserEl) { 
            browserEl.innerHTML = ua.browser.family + " " + ua.browser.major + "." + ua.browser.minor + "." + ua.browser.patch;
        }
    }

    /**
     * Shows warning if it is not added yet and removes
     * warning if it exists
     */
    function toggleWarning () {
        var body, warning, warningHelper, warningContent, isPass;
        
        body = document.getElementsByTagName('body')[0];
        warning = body.getElementsByClassName('badbrowser'); 

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

            showCurrentVersion(warningContent);

            var closeBtns = warning.getElementsByClassName('badbrowser_close');
            for (var i = closeBtns.length - 1; i >= 0; i--) {
                var close = closeBtns[i];
                if (close && close.addEventListener)
                    close.addEventListener('click', closeWarning);
                else if (close && close.attachEvent)
                    close.attachEvent('onclick', closeWarning);
            }

            body.appendChild(warning);
        }
    }

    function closeWarning (event) {
        if (event.target !== this)
            return;
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        toggleWarning();

        document.cookie = "badbrowser_pass=true;" + "expires=" + expireDate.toUTCString();
    }

    function getCookie(name) {
        if (settings.ignoreChoice)
            return;
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
            } catch (err) {
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
            };
            request.open('GET', settings.path + name + '.html', true);
            request.send(null);
        }
    }
})(window, document);