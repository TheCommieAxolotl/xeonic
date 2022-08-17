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

      if (data.prefetched)
        return transformDOM(window.Xeonic.cachedLinks[data.fullURL.href]);

      window.Xeonic.cachedLinks[e.target.href] = await fetch(
        e.target.href
      ).then(async (n) => await n.text());

      if (logs) console.log(`⚡ - Routed to ${e.target.href}`);
      return transformDOM(window.Xeonic.cachedLinks[e.target.href]);
    }
  });

  window.addEventListener("popstate", (e) => {
    e.preventDefault();

    if (logs) console.log(`⚡ - Routed to ${window.location.href}`);
    return transformDOM(window.Xeonic.cachedLinks[window.location.href]);
  });

  return window.Xeonic;
};
