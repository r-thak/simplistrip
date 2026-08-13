(function () {
  // On destination pages: strip Simplify params from the URL bar without reloading.
  try {
    const u = new URL(location.href);
    if (u.searchParams.get("utm_source") === "Simplify") {
      u.searchParams.delete("utm_source");
      u.searchParams.delete("ref");
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
