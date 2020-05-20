import readableId from 'readable-id-mjs'
import { SourcedEntity } from 'sourced'
import debug from 'debug'

const log = debug('microservice')

// log(sourced)

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
