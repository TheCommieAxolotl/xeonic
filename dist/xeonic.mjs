var d = Object.defineProperty;
var f = (r, t, e) => t in r ? d(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var c = (r, t, e) => (f(r, typeof t != "symbol" ? t + "" : t, e), e);
const a = (r) => {
  const t = new DOMParser().parseFromString(r, "text/html"), e = t.querySelector("body"), o = document.querySelector("body");
  o.innerHTML = e.innerHTML;
  const n = t.querySelector("head"), i = document.querySelector("head");
  i.innerHTML = n.innerHTML, window.Xeonic && window.Xeonic.prefetchLinks();
}, s = (r) => {
  const t = r.hasAttribute("xeon-ignore"), e = new URL(r.href), o = e.hostname == window.Xeonic.siteInfo.hostname, n = !o, i = !!window.Xeonic.cachedLinks[e.href];
  return {
    ignored: t,
    fullURL: e,
    local: o,
    external: n,
    prefetched: i
  };
};
class l {
  constructor() {
    c(this, "config", {});
    c(this, "siteInfo", {
      hostname: location.hostname,
      protocol: location.protocol,
      pathname: location.pathname,
      port: location.port,
      href: location.href
    });
    c(this, "cachedLinks", {});
    c(this, "prefetchLinks", async () => {
      const t = document.querySelectorAll("a[href], [xeon-include]");
      for (let e = 0; e < t.length; e++) {
        const o = s(t[e]);
        if (o.ignored || o.external && this.config.ignoreExternal || o.prefetched)
          return;
        this.cachedLinks[t[e].href] = await fetch(t[e].href).then(
          async (n) => await n.text()
        ), this.config.logs && console.log(`\u26A1 - Prefetched ${t[e].href}`);
      }
    });
    c(this, "goBack", () => {
      window.history.back();
    });
    c(this, "goForward", () => {
      window.history.forward();
    });
    c(this, "goTo", async (t) => {
      const e = new URL(t);
      return this.cachedLinks[e.href] = await fetch(e.href).then(
        async (o) => await o.text()
      ), this.config.logs && console.log(`\u26A1 - Routed to ${e.href}`), a(this.cachedLinks[e.href]);
    });
  }
}
const u = (r = {}) => {
  const { ignoreExternal: t = !0, prefetch: e = !0, logs: o = !1 } = r;
  return window.Xeonic = new l(), window.Xeonic.config = {
    ignoreExternal: t,
    prefetch: e,
    logs: o
  }, e && window.Xeonic.prefetchLinks(), window.addEventListener("click", async (n) => {
    if (n.target.tagName === "A" || n.target.hasAttribute("xeon-include")) {
      const i = s(n.target);
      return i.ignored || i.external && t ? void 0 : (n.preventDefault(), i.prefetched ? a(window.Xeonic.cachedLinks[i.fullURL.href]) : (window.Xeonic.cachedLinks[n.target.href] = await fetch(
        n.target.href
      ).then(async (h) => await h.text()), o && console.log(`\u26A1 - Routed to ${n.target.href}`), a(window.Xeonic.cachedLinks[n.target.href])));
    }
  }), window.addEventListener("popstate", (n) => (n.preventDefault(), o && console.log(`\u26A1 - Routed to ${window.location.href}`), a(window.Xeonic.cachedLinks[window.location.href]))), window.Xeonic;
};
export {
  u as initialiseRouter
};
