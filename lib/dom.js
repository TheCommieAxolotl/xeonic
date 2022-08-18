export const transformDOM = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const event = new CustomEvent("xeon:navigated", {});

  const body = doc.querySelector("body");
  const currentBody = document.querySelector("body");
  currentBody.innerHTML = body.innerHTML;

  const head = doc.querySelector("head");
  const currentHead = document.querySelector("head");

  currentHead.innerHTML = head.innerHTML;

  window.dispatchEvent(event);

  if (window.Xeonic) window.Xeonic.prefetchLinks();
};

const getFullHref = (link) => {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", link);
  return anchor.href;
};

export const getStatusFromElement = (element) => {
  const ignored = element.hasAttribute("xeon-ignore");

  let href = getFullHref(element.href || element.getAttribute("href"));

  const fullURL = new URL(href);
  const local = fullURL.href.includes(window.Xeonic.siteInfo.hostname);
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
