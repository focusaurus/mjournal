#!/usr/bin/env node
'use strict'

const _ = require('lodash')
const program = require('commander')
const request = require('superagent')
const stdin = require('stdin')
let BASE = process.env.MJOURNAL_API_URL || 'https://mjournal.peterlyons.com'
BASE = BASE + '/api'

program.usage('--key <key> <command> [options]')
  .option('-k, --key <key>', 'API key for authentication')

function http (method, path) {
  return request[method](BASE + path).set(
    'Authorization', 'key ' + program.key)
}

function exitIfError (error, response) {
  const oops = error || (response && response.error)
  if (oops) {
    const code = oops.code || oops.status
    switch (code) {
      case 'ECONNREFUSED':
        console.error('Could not connect to mjournal server')
        break
      case 401:
        console.error('Incorrect API key')
        break
      case 404:
        console.error('No entry with that id')
        break
      default:
        console.error(oops)
    }
    let exitCode = 10
    if (oops.status) {
      exitCode = oops.status - 400
    }
    process.exit(exitCode)
  }
}

function bodyOption (command) {
  command.option(
    '-b, --body <body>',
    "Content for the journal entry. Pass 'stdin' to provide on stdin"
  )
}

function tagsOption (command) {
  command.option(
    '-t, --tags <tags>', 'Tags for the entry. Space-delimited words.')
}

function printEntry (entry) {
  console.log(
    '----- ID: ' +
    entry.id +
    ' Created: ' +
    entry.created +
    ' -----\ntags: ' +
    (entry.tags || '') +
    '\n\n' +
    entry.body
  )
}

function printEntries (error, response) {
  exitIfError(error, response)
  response.body.forEach(printEntry)
}

function viewAction (options) {
  const opOptions = _.pick(options, 'before', 'after')
  opOptions.textSearch = options.search
  http('get', '/entries')
    .query(opOptions)
    .end(printEntries)
}

function exportAction(options) {
  process.stdout.write("[");
  let first = true;

  function fetch(options = {}) {
    http("get", "/entries")
      .query(options)
      .end(end);
  }

  function end(error, response) {
    exitIfError(error);
    const entries = response.body;

    entries.forEach(entry => {
      if (!first) {
        process.stdout.write(",\n");
      }
      first = false;
      process.stdout.write(JSON.stringify(entry));
    });
    if (entries.length) {
      setTimeout(() => fetch({ before: entries[0].id }), 10);
    } else {
      process.stdout.write("]");
    }
  }

  fetch();
}


program.command('view')
  .description('view entries for a user')
  .option(
    '-a, --after <entryId>',
    'view entries created after the given entry',
    parseInt
).option(
  '-b, --before <entryId>',
  'view entries created before the given entry',
  parseInt
).option(
  '-s, --search <query>',
  'search for entries mentioning or tagged with a keyword'
).action(viewAction)

program.command('export')
  .description('export entries to disk')
  .option(
    '-a, --after <entryId>',
    'export entries created after the given entry',
    parseInt
).option(
  '-b, --before <entryId>',
  'export entries created before the given entry',
  parseInt
).option(
  '-s, --search <query>',
  'search for entries mentioning or tagged with a keyword'
).action(exportAction)

function postEntry (options) {
  const entry = _.pick(options, 'body', 'tags')
  http('post', '/entries')
    .send(entry)
    .end(function (error, response) {
      if (error) {
        switch (error.code) {
          case 'ECONNREFUSED':
            console.error('Could not connect to mjournal server')
            break
          default:
            console.error(error)
        }
        return
      }
      console.log('Entry ' + response.body.id + ' created')
    })
}

function createAction (options) {
  if (options.body === 'stdin') {
    stdin(function (body) {
      options.body = body
      postEntry(options)
    })
  } else {
    postEntry(options)
  }
}

const createCommand = program.command('create')
  .description('create a new journal entry')
  .action(createAction)
bodyOption(createCommand)
tagsOption(createCommand)

function updateAction (options) {
  const opOptions = _.pick(options, 'body', 'tags')
  http('put', '/entries/' + options.entryId)
    .send(opOptions)
    .end(function (error, response) {
      exitIfError(error, response)
      console.log('Entry updated')
    })
}

const updateCommand = program.command('update')
  .option('-e, --entryId <entryId>')
  .description('update an existing entry. Provide new entry body via stdin')
  .action(updateAction)
bodyOption(updateCommand)
tagsOption(updateCommand)

function deleteAction (options) {
  http('del', '/entries/' + options.entryId).end(function (error, response) {
    exitIfError(error, response)
    console.log('Entry deleted')
  })
}

program.command('delete')
  .option('-e, --entryId <entryId>')
  .description('delete an entry')
  .action(deleteAction)

if (require.main === module) {
  program.parse(process.argv)
}
