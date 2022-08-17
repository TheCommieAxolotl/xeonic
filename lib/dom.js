export const transformDOM = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const body = doc.querySelector("body");
  const currentBody = document.querySelector("body");
  currentBody.innerHTML = body.innerHTML;

  const head = doc.querySelector("head");
  const currentHead = document.querySelector("head");

  currentHead.innerHTML = head.innerHTML;

  if (window.Xeonic) window.Xeonic.prefetchLinks();
};

export const getStatusFromElement = (element) => {
  const ignored = element.hasAttribute("xeon-ignore");
  const fullURL = new URL(element.href);
  const local = fullURL.hostname == window.Xeonic.siteInfo.hostname;
  const external = !local;
  const prefetched = !!window.Xeonic.cachedLinks[fullURL.href];

  return {
    ignored,
    fullURL,
    local,
    external,
    prefetched,
  };
};
