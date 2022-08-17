import { getStatusFromElement, transformDOM } from "./dom";

export default class Route {
  config = {};
  siteInfo = {
    hostname: location.hostname,
    protocol: location.protocol,
    pathname: location.pathname,
    port: location.port,
    href: location.href,
  };
  cachedLinks = {};

  prefetchLinks = async () => {
    const links = document.querySelectorAll("a[href], [xeon-include]");

    for (let i = 0; i < links.length; i++) {
      const data = getStatusFromElement(links[i]);

      if (data.ignored) return;
      if (data.external && this.config.ignoreExternal) return;
      if (data.prefetched) return;

      this.cachedLinks[links[i].href] = await fetch(links[i].href).then(
        async (n) => await n.text()
      );

      if (this.config.logs) console.log(`⚡ - Prefetched ${links[i].href}`);
    }
  };

  goBack = () => {
    window.history.back();
  };

  goForward = () => {
    window.history.forward();
  };

  goTo = async (url) => {
    const fullURL = new URL(url);

    this.cachedLinks[fullURL.href] = await fetch(fullURL.href).then(
      async (n) => await n.text()
    );

    if (this.config.logs) console.log(`⚡ - Routed to ${fullURL.href}`);

    return transformDOM(this.cachedLinks[fullURL.href]);
  };
}
