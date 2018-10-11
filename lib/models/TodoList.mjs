import readableId from 'readable-id-mjs'
import sourced from 'sourced'
import debug from 'debug'

const log = debug('microservice')

log(sourced)

const { SourcedEntity } = sourced

export class TodoList extends SourcedEntity {
  constructor () {
    super()
    this.items = []
  }

  initialize ({ id }) {
    this.id = id
    this.digest('initialize', { id })
    this.enqueue('initialized', this)
  }

  addItem ({
    id = readableId(),
    todo,
    complete = false
  } = {}) {
    if (!todo) throw new Error('todo is required')

    let item = { id, todo, complete }

    this.items.push(item)
    this.digest('addItem', item)
    this.enqueue('item.added', item)
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
        this.enqueue('item.completed', item)
        return item
      })
  }
}
