var methods = {
  get: {
    method: "GET",
    isArray: true
  },
  update: {
    method: "PUT"
  },
  create: {
    method: "POST"
  }
};

function entriesFactory($resource) {
  return $resource("/api/entries/:id", {id: "@id"}, methods);
}

module.exports = entriesFactory;
