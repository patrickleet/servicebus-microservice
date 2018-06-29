import readableId from 'readable-id-mjs'
import sourced from 'sourced'

const { Entity } = sourced

export class TodoList extends Entity {
  constructor () {
    super()
    this.items = []
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

    let item = { id, todo, complete }

    this.items.push(item)
    this.digest('addItem', item)
    this.emit('item.added', item)
  }

  markItemAsComplete ({ id }) {
    this.items
      .filter(item => item.id === id)
      .map(item => ({...item, complete: true}))
      .map(item => {
        this.digest('markAsCompleted', {id})
        return item
      })
      .map(item => {
        this.emit('item.completed', item)
        return item
      })
  }
}
