# @dvhb/badbrowser [![Build Status](https://travis-ci.org/dvhb/badbrowser.svg?branch=master)](https://travis-ci.org/dvhb/badbrowser)

## Install
```
npm i @dvhb/badbrowser
```

## Demo
http://dvhb.github.io/badbrowser/

## Using
Put html for your custom alert windows in `/alerts/` with this pattern:
```
alerts/
 ru.html
 en.html
 ...
```

```js
import badbrowser from '@dvhb/badbrowser'
```

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
