function entriesFactory($resource) {
  return $resource("/api/entries/:id", {
    id: "@id"
  }, {
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
  });
}

module.exports = entriesFactory;
