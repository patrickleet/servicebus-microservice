import { command, listen } from 'list.item.add.mjs'

jest.mock('llog')

describe('The list.item.add command handler', () => {
  it('should exist', () => {
    expect(command).toBeDefined()
    expect(typeof command === 'string').toBe(true)
    expect(listen).toBeDefined()
    expect(typeof listen === 'function').toBe(true)
  })

  it('should handle an command with the listen function', () => {
    let command = {
      type: 'list.item.added',
      data: {
        item: {
          todo: 'write this test',
          completed: false
        }
      },
      datetime: new Date()
    }

    let context = {
      bus: {
        publish: jest.fn()
      }
    }

    let done = jest.fn()

    listen.call(context, command, done)

    expect(context.bus.publish).toBeCalledWith('list.item.added', {"completed": false, "todo": "write this test"})
    expect(done).toBeCalled()
  })
})
