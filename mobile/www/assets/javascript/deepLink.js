(function() {
  if (window.location.search.includes('redirect_route')) {
    let url = window.location.href.split('myvoyageui')[0] + 'myvoyageui/#';

    if (window.location.search.includes('&')) {
      const splitRoute = window.location.search.slice(1).split('&');
      let params = '';
      let i = 0;
      for (let queryParam of splitRoute) {
        if (queryParam.includes('redirect_route')) {
          const paramVal = queryParam
            .split('=')
            .slice(1)
            .join('=');
          url += paramVal;
        }
        params += '&' + splitRoute[i];
        i++;
      }
      if (params !== undefined) {
        url.includes('?') ? (url += '&') : (url += '?');
        url += params.slice(1);
      }
    } else {
      const splitRoute = window.location.search
        .split('redirect_route')[1]
        .split('=');
      url += splitRoute.slice(1).join('=');
    }
    window.location.href = url;
  }
})();
