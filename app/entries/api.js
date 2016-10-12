'use strict'

const _ = require('lodash')
const api = require('../api')
const json = require('body-parser').json()
const operations = require('./operations')
const router = require('express').Router()

function viewEntries (req, res) {
  const options = _.pick(req.query, 'page', 'after', 'before', 'textSearch')
  options.user = req.user
  operations.view(options, api.sendResult(res))
}

function createEntry (req, res) {
  const options = _.pick(req.body, 'body', 'tags')
  options.user = req.user
  operations.create(options, api.sendResult(res))
}

function updateEntry (req, res) {
  const options = _.pick(req.body, 'body', 'tags')
  options.id = req.params.id
  options.user = req.user
  operations.update(options, api.sendResult(res))
}

function deleteEntry (req, res) {
  const options = _.pick(req.params, 'id')
  options.user = req.user
  operations.delete(options, function (error) {
    if (error) {
      res.status(error.statusCode || 500).send()
      return
    }
    res.send()
  })
}

function viewTags (req, res) {
  operations.viewTags({user: req.user}, api.sendResult(res))
}

router.route('/')
  .get(viewEntries)
  .post(json, createEntry)
router.put('/:id', json, updateEntry)
router.delete('/:id', deleteEntry)
router.get('/tags', viewTags)

module.exports = router
