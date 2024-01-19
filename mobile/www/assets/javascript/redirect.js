(function() {
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
  if (isMobileDevice) {
    if (window.navigator.userAgent.match(/Android/i)) {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.voya.edt.myvoyage';
      return;
    } else if (
      window.navigator.userAgent.match(/iPad/i) ||
      window.navigator.userAgent.match(/iPhone/i) ||
      window.navigator.userAgent.match(/iPod/i)
    ) {
      window.location.href =
        'https://apps.apple.com/us/app/myvoyage/id1594192157';
      return;
    }
  }
  window.location.href =
    window.location.href.split('myvoyageui')[0] +
    'myvoyageui/index.html' +
    window.location.search;
})();
