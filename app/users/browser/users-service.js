'use strict'

var methods = {
  update: {
    method: 'PUT'
  }
}

function usersService ($resource) {
  return $resource('/api/users', {}, methods)
}

module.exports = usersService
