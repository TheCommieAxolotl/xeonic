import { transformDOM, getStatusFromElement } from "./dom";
import Route from "./routes";

export const initialiseRouter = (options = {}) => {
  const { ignoreExternal = true, prefetch = true, logs = false } = options;

  window.Xeonic = new Route();

  window.Xeonic.config = {
    ignoreExternal,
    prefetch,
    logs,
  };

  if (prefetch) window.Xeonic.prefetchLinks();

  window.addEventListener("click", async (e) => {
    if (e.target.tagName === "A" || e.target.hasAttribute("xeon-include")) {
      const data = getStatusFromElement(e.target);

      if (data.ignored) return;
      if (data.external && ignoreExternal) return;

      e.preventDefault();

      window.addEventListener(
        "xeon:navigate",
        function (evt) {
          console.log(evt);
        },
        false
      );

      const event = new CustomEvent("xeon:will-navigate", {
        detail: data.fullURL.href,
      });

      window.dispatchEvent(event);

      if (data.prefetched) {
        window.Xeonic.activeIndex++;
        window.Xeonic.history.push(data.fullURL.href);

        if (logs) console.log(`\u26A1 - Routed to ${data.fullURL.href}`);
        return transformDOM(window.Xeonic.cachedLinks[data.fullURL.href]);
      }

      window.Xeonic.cachedLinks[data.fullURL.href] = await fetch(
        data.fullURL.href
      ).then(async (n) => await n.text());

      window.Xeonic.activeIndex++;
      window.Xeonic.history.push(data.fullURL.href);

      if (logs) console.log(`⚡ - Routed to ${data.fullURL.href}`);
      return transformDOM(window.Xeonic.cachedLinks[data.fullURL.href]);
    }
  });

  window.addEventListener("popstate", (e) => {
    e.preventDefault();

    const event = new CustomEvent("xeon:will-navigate", {
      detail: data.fullURL.href,
    });

    window.dispatchEvent(event);

    window.Xeonic.activeIndex++;
    window.Xeonic.history.push(window.location.href);

    if (logs) console.log(`⚡ - Routed to ${window.location.href}`);
    return transformDOM(window.Xeonic.cachedLinks[window.location.href]);
  });

  return window.Xeonic;
};
