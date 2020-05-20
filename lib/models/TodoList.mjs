import readableId from 'readable-id-mjs'
import * as sourced from 'sourced'
import debug from 'debug'

const log = debug('microservice')

// weird mjs workaround - babel and node 14 load modules differently.
// https://2ality.com/2015/12/babel-commonjs.html#why-mark-transpiled-es6-modules-with-the-flag-esmodule
let SourcedEntity
if (sourced.default) {
  SourcedEntity = sourced.default.SourcedEntity
} else {
  SourcedEntity = sourced.SourcedEntity
}

log(SourcedEntity)

export class TodoList extends SourcedEntity {
  constructor (snapshot, events) {
    super()
    this.items = []
    this.rehydrate(snapshot, events)
  }

  initialize ({ id }) {
    this.id = id
    this.digest('initialize', { id })
    this.emit('initialized', this)
  }

  addItem ({
    id = readableId(),
    todo,
    complete = false
  } = {}) {
    if (!todo) throw new Error('todo is required')

    const item = { id, todo, complete }

    this.items.push(item)
    this.digest('addItem', item)
    this.emit('item.added', item)
  }

  markItemAsComplete ({ id }) {
    this.items
      .filter(item => item.id === id)
      .map(item => ({ ...item, complete: true }))
      .map(item => {
        this.digest('markAsCompleted', { id })
        return item
      })
      .map(item => {
        this.emit('item.completed', item)
        return item
      })
  }
}
