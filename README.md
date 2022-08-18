# ⚡ Xeonic
A simple, fast, and tiny Library for spa-style routing for static sites.

## Usage
```bash
npm i xeonic
```

```js
import { initialiseRouter } from 'xeonic';
initialiseRouter();
```

```html
<script type="module">
    import { initialiseRouter } from '/path/to/xeonic.mjs';
    initialiseRouter();
</script>
```

...and that's it!

## Features
Even though xeonic is similar to many other libraries, it has some other features.

### Opt-In Elements
*Any* element can be used as a xeonic link, not just anchor tags.
```html
<div xeon-include href="/homepage">Hey, I'm a link now!</div>
```
All you need to do is add the `xeon-include` and `href` attributes to the element.

### Independent History
Xeonic stores its own history in `window.Xeonic.history`.
You can pop or push pages with 
```js
Xeonic.goBack()
Xeonic.goForward()
Xeonic.goTo("url")
```

## Configuration
```js
import { initialiseRouter } from 'xeonic';
initialiseRouter({
    ignoreExternal: true, // ignore external links, WARNING: you may encounter errors with CORS if this is disabled
    prefetch: true, // prefetch links for faster navigation
    logs: true, // logs all navigation events to the console
});
```

## TODO
- [x] Add listenable navigation events
- [x] Add ability to navigate back and forward
- [ ] Add a `mergeHead` option to merge the heads of documents and not replace them

## Inspiration
This Project is heavily inspired by [flamethrower](https://github.com/fireship-io/flamethrower)
