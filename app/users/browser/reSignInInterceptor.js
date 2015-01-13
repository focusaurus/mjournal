function reSignInInterceptor($q, $timeout, $quickDialog, sessionTtl) {
  var expiredPromise;
  function dialog() {
    $quickDialog.open("reSignIn");
  }
  return {
    responseError: function reSignIn(res) {
      if (res.config.url === "/api/users/key") {
        return $q.reject(res);
      }
      if (res.status === 401) {
        dialog();
      }
      return $q.reject(res);
    },
    response: function (res) {
      if (expiredPromise) {
        $timeout.cancel(expiredPromise);
      }
      // HTTP cookie max-age is seconds, JS timeout is milliseconds
      expiredPromise = $timeout(dialog, sessionTtl * 1000);
      return res;
    }
  };
}

module.exports = reSignInInterceptor;
