# ⚡ Xeonic
A simple, fast, and tiny Library for spa-style routing and hydration between pages.

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
    import { initialiseRouter } from 'xeonic';
    initialiseRouter();
</script>
```

...and that's it!

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
- [ ] Add listenable navigation events
- [ ] Add ability to navigate back and forward
- [ ] Add a `mergeHead` option to merge the heads of documents and not replace them

## Inspiration
This Project is heavily inspired by [flamethrower](https://github.com/fireship-io/flamethrower)
