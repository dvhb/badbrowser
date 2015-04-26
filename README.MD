# Bad Browser
## Install
```
bower install path_to_repository
```
## Using
Put html for your alert windows in `/alerts/` with this pattern:
```
alerts/
 ru.html
 ru.mobile.html
 en.html
 en.mobile.html
 ...
```
```html
<script src="../lib/badbrowser.js"></script>
```

Call `badbrowser.init`

```js
badbrowser.init({
    // lang of the alert window
    lang: 'en',
    // path to your html alerts
    path: '/alerts/',
    // if `false` then user's choice will be saved in the cookies
    // and alert window will not be showen next time
    ignoreChoice: false,
    // Min version of browser that will be supported
    supported: {
        // user of chrome v.39 will see an alert winodw
        chrome: 40,
        firefox: 34,
        ie: 9,
        opera: 26,
        android: 10,
        safari: 6,
        // if `false`, will show alert for any mobile browser
        mobile: false
    }
})
```

Instead of specifying *supported* property you can specify *unsupported* browsers:
```
badbrowser.init({
    lang: 'en',
    unsupported: {
        // the same as supported.chrome = 40
        chrome: 39,
        // the same as supported.firefox = 34
        firefox: 33,
        // will show alert for any mobile browser
        mobile: true
    }
})
```