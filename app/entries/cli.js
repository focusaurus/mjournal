#!/usr/bin/env node
/* eslint no-process-exit:0 */
/*eslint no-console:0*/
const _ = require('lodash')
const cli = require('../cli')
const readline = require('readline')
const entryOps = require('./operations')
const program = require('commander')

function bodyOption (stack) {
  stack.command.option(
    '-b, --body <body>',
    "Content for the journal entry. Pass 'stdin' to provide on stdin"
  )
  stack.use(function (options, next) {
    let input, lines
    if (options.body === 'stdin') {
      input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      lines = []
      input.on('line', function (line) {
        return lines.push(line)
      })
      input.on('close', function () {
        options.body = lines.join('\n')
        next()
      })
      console.log('Type body then ctrl-d when done')
    } else {
      next()
    }
  })
}

function tagsOption (stack) {
  stack.command.option(
    '-t, --tags <tags>', 'Tags for the entry. Space-delimited words.')
  return stack
}

function viewAction (options) {
  options.textSearch = options.search
  const opOptions = _.pick(options, 'user', 'page', 'textSearch')
  entryOps.view(opOptions, function (error, entries) {
    if (error) {
      cli.exit(error)
    }
    entries.forEach(function (entry) {
      console.log(
        '----- ID: ' + entry.id + ' Created: ' + entry.created + ' -----\n' +
        'tags: ' + (entry.tags || '') + '\n\n' +
        entry.body
      )
    })
    process.exit()
  })
}

const viewStack = cli.command(program, 'view', 'view entries for a user')
cli.signInMW(viewStack)
cli.paginate(viewStack).use(viewAction)

function createAction (options) {
  const opOptions = _.pick(options, 'user', 'body', 'tags')
  entryOps.create(opOptions, function (error, entry) {
    if (error) {
      cli.exit(error)
    }
    console.log(entry)
    process.exit()
  })
}

const createStack = cli.command(
  program, 'create', 'create a new journal entry')
cli.signInMW(createStack)
bodyOption(createStack)
tagsOption(createStack).use(createAction)

function updateAction (commandOptions) {
  const options = _.pick(commandOptions, 'user', 'body', 'tags')
  options.id = commandOptions.entryId
  entryOps.update(options, function (error) {
    if (error) {
      cli.exit(error)
    }
    console.log('Entry updated')
    process.exit()
  })
}

const updateStack = cli.command(
  program,
  'update',
  'update an existing entry')
updateStack.command.option('-i, --entryId <entryId>')
cli.signInMW(updateStack)
bodyOption(updateStack)
tagsOption(updateStack).use(updateAction)

program.description('operate on entry records')

if (require.main === module) {
  program.parse(process.argv)
}

exports.bodyOption = bodyOption
exports.tagsOption = tagsOption
exports.updateAction = updateAction
