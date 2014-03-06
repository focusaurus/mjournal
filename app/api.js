function sendResult(res) {
  return function(error, result) {
    if (error) {
      res.status(500);
      res.send();
      return;
    }
    if (!result) {
      res.status(404);
      res.send();
      return;
    }
    res.send(result);
  };
}

module.exports = {
  sendResult: sendResult
};
