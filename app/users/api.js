'use strict'

const _ = require('lodash')
const json = require('body-parser').json()
const log = require('../log')
const operations = require('./operations')
const router = require('express').Router()

function respond (res) {
  return function _respond (error, user) {
    if (error) {
      res.status(error.status || 403).send(error)
      return
    }
    const session = res.req.session
    user.theme = user.theme || "moleskine"
    session.user = res.req.user = user
    session.save(function (error2) {
      if (error2) {
        log.error(error2, 'session.save failed')
        return
      }
      res.send(user)
    })
  }
}

function signIn (req, res) {
  log.debug({email: req.body.email}, 'sign-in attempt')
  const options = _.pick(req.body, 'email', 'password')
  operations.signIn(options, respond(res))
}

function signUp (req, res) {
  log.debug({email: req.body.email}, 'sign-up attempt')
  const options = _.pick(req.body, 'email', 'password')
  res.status(201)
  operations.signUp(options, respond(res))
}

function signOut (req, res) {
  log.debug({user: req.user}, 'signing out')
  req.session.destroy(function (error) {
    if (error) {
      log.error(error, 'session.destroy failed')
    }
    res.redirect('/')
  })
}

function createKey (req, res, next) {
  log.debug({user: req.user}, 'creating key')
  const options = {
    user: req.user
  }
  res.status(201)
  operations.createKey(options, function (error, result) {
    if (error) {
      next(error)
      return
    }
    res.json({key: result})
  })
}

function update (req, res, next) {
  log.debug({user: req.user}, 'updating user')
  const options = {
    user: req.user
  }
  _.extend(options, _.pick(req.body, 'theme', 'email'))
  operations.update(options, function (error, user) {
    if (error) {
      next(error)
      return
    }
    req.session.user = req.user = user
    res.json(user)
  })
}

router.post('/sign-in', json, signIn)
router.post('/sign-up', json, signUp)
router.get('/sign-out', signOut)
router.post('/key', createKey)
router.put('/', json, update)

module.exports = router
