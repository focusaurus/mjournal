function reSignInInterceptor($q, $quickDialog) {
  return {
    responseError: function reSignIn(res) {
      console.log("@bug reSignIn for responseError", res);
      if (res.status === 401) {
        console.log("@bug reSignIn needs to prompt!");
        $quickDialog.open("reSignIn");
      }
      return $q.reject(res);
    }
  };
}

module.exports = reSignInInterceptor;
