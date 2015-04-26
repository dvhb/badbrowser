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