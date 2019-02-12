# @dvhb/badbrowser [![Build Status](https://travis-ci.org/dvhb/badbrowser.svg?branch=master)](https://travis-ci.org/dvhb/badbrowser)

## Install
```
npm i @dvhb/badbrowser
```

## Demo
http://dvhb.github.io/badbrowser/

## Using
```js
import badbrowser from '@dvhb/badbrowser';

new badbrowser();
```

You can put html for custom alert windows in `/alerts/` with this pattern:
```
alerts/
 ru.html
 en.html
 ...
```

You may take an example of html code for your custom alert from `/dist/alerts/en.html`


### Example

Desktop

* Microsoft Edge, 12+;
* Mozilla Firefox, 37+;
* Google Chrome, 41+;
* Opera, 28+;
* Apple Safari, 8+;
* Yandex Browser, 15+.

Mobile

* Mobile Safari, 7+
* Android Browser, 4+
* Chrome Mobile, 41+;
* Internet Explorer Mobile, 11+;

```js
new badbrowser({
    // Min version of browser that will be supported
    supported: {
        msedge: '12',
        firefox: '37',
        chrome: '41',
        opera: '28',
        safari: '8',
        yandexbrowser: '15',
        safari_mobile: '7',
        android: '4',
        chrome_mobile: '41',
        msie_mobile: '11'
    },

    // path to your html alerts
    // could be a function:
    // function (ua) {
    //   return '/alerts/' + lang + '.html'
    // }
    path: '/alerts/en.html',
    // if `false` then user's choice will be saved in the cookies
    // and alert window will not be showen next time
    ignoreChoice: false
})
```

Instead of specifying *supported* property you can specify *unsupported* browsers:
```js
new badbrowser({
    unsupported: {
        // the same as supported.chrome = '40'
        chrome: '39',
        // the same as supported.firefox = '34'
        firefox: '33',
        // will show alert for any mobile browser
        mobile: true
    }
})
```

Also you can get the flag that indicates compatibility of a current browser
```js
let bb = new badbrowser({
    unsupported: {
        // the same as supported.chrome = '40'
        chrome: '39',
        // the same as supported.firefox = '34'
        firefox: '33',
        // will show alert for any mobile browser
        mobile: true
    }
})

let isSupported = bb.check();
```
You can manually control warning window: \
Shows warning if it is not added yet and removes warning if it exists.
```js
bb.toggleWarning();
```
## Default settings object
```js
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
    mobile: true
  }
}
```

## Browser flags

  * `chrome`
  * `firefox`
  * `msie`
  * `msedge`
  * `safari`
  * `yandexbrowser`
  * `android`
  * `ios`
  * `opera`
  * `samsungBrowser`
  * `phantom`
  * `blackberry`
  * `webos`
  * `silk`
  * `bada`
  * `tizen`
  * `seamonkey`
  * `sailfish`
  * `ucbrowser`
  * `qupzilla`
  * `vivaldi`
  * `sleipnir`
  * `kMeleon`

# LICENSE
[MIT License](./LICENSE) © [dvhb](https://dvhb.com/)
