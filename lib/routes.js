import { getStatusFromElement, transformDOM } from "./dom";

export default class Route {
  constructor() {
    this.history.push(this.siteInfo.href);
  }

  config = {};
  siteInfo = {
    hostname: location.hostname,
    protocol: location.protocol,
    pathname: location.pathname,
    port: location.port,
    href: location.href,
  };
  cachedLinks = {};
  history = [];
  activeIndex = 0;

  prefetchLinks = async () => {
    const links = document.querySelectorAll("a[href], [xeon-include]");

    for (let i = 0; i < links.length; i++) {
      const data = getStatusFromElement(links[i]);

      if (data.ignored) return;
      if (data.external && this.config.ignoreExternal) return;
      if (data.prefetched) return;

      this.cachedLinks[data.fullURL.href] = await fetch(data.fullURL.href).then(
        async (n) => await n.text()
      );

      if (this.config.logs) console.log(`⚡ - Prefetched ${data.fullURL.href}`);
    }
  };

  goBack = () => {
    const url = this.history[this.activeIndex - 1];

    const event = new CustomEvent("xeon:back", {
      detail: url,
    });

    if (this.config.logs) console.log("⚡ - Going back");

    if (url) {
      this.activeIndex--;
      window.dispatchEvent(event);
      return this.goTo(url);
    }

    window.dispatchEvent(event);
    return window.history.back();
  };

  goForward = () => {
    const url = this.history[this.activeIndex + 1];

    const event = new CustomEvent("xeon:forward", {
      detail: url,
    });

    if (this.config.logs) console.log("⚡ - Going forward");

    if (url) {
      this.activeIndex++;
      window.dispatchEvent(event);
      return this.goTo(url);
    }

    window.dispatchEvent(event);
    return window.history.forward();
  };

  goTo = async (url) => {
    const fullURL = new URL(url);

    const event = new CustomEvent("xeon:will-navigate", {
      detail: data.fullURL.href,
    });

    this.cachedLinks[fullURL.href] = await fetch(fullURL.href).then(
      async (n) => await n.text()
    );

    if (this.config.logs) console.log(`⚡ - Routed to ${fullURL.href}`);

    this.activeIndex++;
    this.history.push(window.location.href);

    window.dispatchEvent(event);
    return transformDOM(this.cachedLinks[fullURL.href]);
  };
}
