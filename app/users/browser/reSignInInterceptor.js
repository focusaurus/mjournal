function reSignInInterceptor($q, $timeout, $quickDialog, sessionTtl) {
  var expiredPromise;
  function dialog() {
    $quickDialog.open("reSignIn");
  }
  return {
    responseError: function reSignIn(res) {
      if (res.status === 401) {
        dialog();
      }
      return $q.reject(res);
    },
    response: function (res) {
      if (expiredPromise) {
        $timeout.cancel(expiredPromise);
      }
      expiredPromise = $timeout(dialog, sessionTtl);
      return res;
    }
  };
}

module.exports = reSignInInterceptor;
