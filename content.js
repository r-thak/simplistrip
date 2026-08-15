(function () {
  // Known trackers: each maps a utm_source value to the extra params to strip
  // alongside it.
  const TRACKERS = {
    Simplify: ["ref"],
    zero2sudo: ["utm_medium"],
  };

  // On destination pages: strip tracking params from the URL bar without reloading.
  try {
    const u = new URL(location.href);
    const source = u.searchParams.get("utm_source");
    if (Object.prototype.hasOwnProperty.call(TRACKERS, source)) {
      u.searchParams.delete("utm_source");
      TRACKERS[source].forEach((param) => u.searchParams.delete(param));
      history.replaceState(null, document.title, u.toString());
    }
  } catch (_) {}

  // On source pages (e.g. GitHub): add rel="noreferrer" to Simplify Apply links
  // so the browser doesn't send a Referer header, preventing job boards from 403ing.
  function fixLinks() {
    document.querySelectorAll('a[href*="utm_source=Simplify"]').forEach((a) => {
      if (!a.rel.includes("noreferrer")) {
        a.rel = (a.rel + " noreferrer").trim();
      }
    });
  }
  fixLinks();
  new MutationObserver(fixLinks).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
