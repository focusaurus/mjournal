'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const signUp = require('./operations/signUp')
const testUtils = require('../testUtils')

let group = 'POST /api/users/sign-in'
let users = [
  {},
  {email: 'test@example.com'},
  {password: 'password'}
]
users.forEach(function (user) {
  tap.test('should 400 incomplete credentials', function (assert) {
    testUtils.post('/api/users/sign-in')
      .send(user)
      .expect(400)
      .end(assert.end.bind(assert))
  })
})

tap.test(group + ' should 200 a valid user', function (assert) {
  const newUser = {
    email: 'users/api/signUp@example.com',
    password: 'password'
  }
  signUp(newUser, function (error) {
    assert.error(error)
    testUtils.post('/api/users/sign-in')
      .send(newUser)
      .expect(200)
      .end(assert.end.bind(assert))
  })
})

group = 'POST /api/users/sign-up'
users = [
  {},
  {email: 'test@example.com'},
  {password: 'password'}
]
users.forEach(function (user) {
  tap.test(group + ' should 400 incomplete credentials', function (assert) {
    testUtils.post('/api/users/sign-up')
      .send(user)
      .expect(400)
      .end(assert.end.bind(assert))
  })
})

tap.test(group + ' should 409 a re-register', function (assert) {
  const newUser = {
    email: 'users/api/signUp/re-register@example.com',
    password: 'password'
  }
  signUp(newUser, function (error) {
    assert.error(error)
    testUtils.post('/api/users/sign-up')
      .send(newUser)
      .expect(409)
      .end(assert.end.bind(assert))
  })
})

group = 'POST /api/users/key anonymous'
tap.test(group + ' should 401 an anonymous user', function (assert) {
  testUtils.post('/api/users/key')
    .expect(401)
    .end(assert.end.bind(assert))
})

group = 'PUT /api/users anonymous'
tap.test(group + ' should 401 an anonymous user', function (assert) {
  testUtils.put('/api/users')
    .expect(401)
    .end(assert.end.bind(assert))
})

group = 'POST /api/users/key authorized'
let session = testUtils.session()
let key
tap.test('setup', function (assert) {
  session.post('/api/users/sign-up')
    .send({email: 'key/authorized@example.com', password: 'password'})
    .expect(201)
    .end(assert.end.bind(assert))
})

tap.test(group + ' should 201 a key for a known user', function (assert) {
  session.post('/api/users/key')
    .expect(201)
    .end(function (error, res) {
      assert.error(error)
      assert.ok(res.body.key)
      assert.equal(res.body.key.length, 20)
      key = res.body.key
      assert.end()
    })
})

// test depends on previous one. kthnxbai.
tap.test(group + ' should allow access to entries with key', function (assert) {
  testUtils.get('/api/entries')
    .set('Authorization', 'key ' + key)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(assert.end.bind(assert))
})
