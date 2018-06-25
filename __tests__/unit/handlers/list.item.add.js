import { command, listen } from 'list.item.add.mjs'

jest.mock('llog')
jest.mock('repos/todoListRepository', () => ({
  todoListRepository: {
    getAsync: jest.fn(),
    commitAsync: jest.fn()
  }
}))

jest.mock('models/TodoList', () => {
  let Entity = require('sourced').Entity
  class TodoList extends Entity {
    constructor() {
      super()
      this.items = []
      this.initialize = jest.fn()
      this.addItem = jest.fn()
    }
  }
  return { TodoList }
})

describe('The list.item.add command handler', () => {
  it('should exist', () => {
    expect(command).toBeDefined()
    expect(typeof command === 'string').toBe(true)
    expect(listen).toBeDefined()
    expect(typeof listen === 'function').toBe(true)
  })

  it('should handle an command with the listen function', (done) => {
    let command = {
      type: 'list.item.added',
      data: {
        todoListId: 'test',
        item: {
          todo: 'write this test',
          completed: false
        }
      },
      datetime: new Date()
    }


    let publishSpy = jest.fn()

    let context = {
      bus: {
        publish: jest.fn()
      }
    }

    let cb = jest.fn(() => {
      expect(context.bus.publish).toBeCalledWith('list.item.added', {'completed': false, 'todo': 'write this test'})
      expect(cb).toBeCalled()
      done()
    })

    listen.call(context, command, cb)
  })
})
