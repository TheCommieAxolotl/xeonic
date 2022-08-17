var l = Object.defineProperty;
var f = (i, t, e) => t in i ? l(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var r = (i, t, e) => (f(i, typeof t != "symbol" ? t + "" : t, e), e);
const s = (i) => {
  const t = new DOMParser().parseFromString(i, "text/html"), e = new CustomEvent("xeon:navigated", {}), n = t.querySelector("body"), c = document.querySelector("body");
  c.innerHTML = n.innerHTML;
  const o = t.querySelector("head"), a = document.querySelector("head");
  a.innerHTML = o.innerHTML, window.dispatchEvent(e), window.Xeonic && window.Xeonic.prefetchLinks();
}, d = (i) => {
  const t = i.hasAttribute("xeon-ignore"), e = new URL(i.href || i.getAttribute("href")), n = e.hostname == window.Xeonic.siteInfo.hostname, c = !n, o = !!window.Xeonic.cachedLinks[e.href];
  return {
    ignored: t,
    fullURL: e,
    local: n,
    external: c,
    prefetched: o
  };
};
class w {
  constructor() {
    r(this, "config", {});
    r(this, "siteInfo", {
      hostname: location.hostname,
      protocol: location.protocol,
      pathname: location.pathname,
      port: location.port,
      href: location.href
    });
    r(this, "cachedLinks", {});
    r(this, "history", []);
    r(this, "activeIndex", 0);
    r(this, "prefetchLinks", async () => {
      const t = document.querySelectorAll("a[href], [xeon-include]");
      for (let e = 0; e < t.length; e++) {
        const n = d(t[e]);
        if (n.ignored || n.external && this.config.ignoreExternal || n.prefetched)
          return;
        this.cachedLinks[n.fullURL.href] = await fetch(n.fullURL.href).then(
          async (c) => await c.text()
        ), this.config.logs && console.log(`\u26A1 - Prefetched ${n.fullURL.href}`);
      }
    });
    r(this, "goBack", () => {
      const t = this.history[this.activeIndex - 1], e = new CustomEvent("xeon:back", {
        detail: t
      });
      return this.config.logs && console.log("\u26A1 - Going back"), t ? (this.activeIndex--, window.dispatchEvent(e), this.goTo(t)) : (window.dispatchEvent(e), window.history.back());
    });
    r(this, "goForward", () => {
      const t = this.history[this.activeIndex + 1], e = new CustomEvent("xeon:forward", {
        detail: t
      });
      return this.config.logs && console.log("\u26A1 - Going forward"), t ? (this.activeIndex++, window.dispatchEvent(e), this.goTo(t)) : (window.dispatchEvent(e), window.history.forward());
    });
    r(this, "goTo", async (t) => {
      const e = new URL(t), n = new CustomEvent("xeon:will-navigate", {
        detail: data.fullURL.href
      });
      return this.cachedLinks[e.href] = await fetch(e.href).then(
        async (c) => await c.text()
      ), this.config.logs && console.log(`\u26A1 - Routed to ${e.href}`), this.activeIndex++, this.history.push(window.location.href), window.dispatchEvent(n), s(this.cachedLinks[e.href]);
    });
    this.history.push(this.siteInfo.href);
  }
}
const g = (i = {}) => {
  const { ignoreExternal: t = !0, prefetch: e = !0, logs: n = !1 } = i;
  return window.Xeonic = new w(), window.Xeonic.config = {
    ignoreExternal: t,
    prefetch: e,
    logs: n
  }, e && window.Xeonic.prefetchLinks(), window.addEventListener("click", async (c) => {
    if (c.target.tagName === "A" || c.target.hasAttribute("xeon-include")) {
      const o = d(c.target);
      if (o.ignored || o.external && t)
        return;
      c.preventDefault(), window.addEventListener(
        "xeon:navigate",
        function(h) {
          console.log(h);
        },
        !1
      );
      const a = new CustomEvent("xeon:will-navigate", {
        detail: o.fullURL.href
      });
      return window.dispatchEvent(a), o.prefetched ? (window.Xeonic.activeIndex++, window.Xeonic.history.push(o.fullURL.href), n && console.log(`\u26A1 - Routed to ${o.fullURL.href}`), s(window.Xeonic.cachedLinks[o.fullURL.href])) : (window.Xeonic.cachedLinks[o.fullURL.href] = await fetch(
        o.fullURL.href
      ).then(async (h) => await h.text()), window.Xeonic.activeIndex++, window.Xeonic.history.push(o.fullURL.href), n && console.log(`\u26A1 - Routed to ${o.fullURL.href}`), s(window.Xeonic.cachedLinks[o.fullURL.href]));
    }
  }), window.addEventListener("popstate", (c) => {
    c.preventDefault();
    const o = new CustomEvent("xeon:will-navigate", {
      detail: data.fullURL.href
    });
    return window.dispatchEvent(o), window.Xeonic.activeIndex++, window.Xeonic.history.push(window.location.href), n && console.log(`\u26A1 - Routed to ${window.location.href}`), s(window.Xeonic.cachedLinks[window.location.href]);
  }), window.Xeonic;
};
export {
  g as initialiseRouter
};
