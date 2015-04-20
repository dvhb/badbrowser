# Bad Browser
## Using
Put html for your alerts window in `/alerts/` with this pattern:
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

```js
badbrowser.init({
    lang: 'en',
    supported: {
        chrome: 30,
        mobile: false
    }
})
```