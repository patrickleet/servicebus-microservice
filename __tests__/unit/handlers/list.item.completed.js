import { event, subscribe } from 'list.item.completed.mjs'

jest.mock('llog')

describe('The list.item.completed event handler', () => {
  it('should exist', () => {
    expect(event).toBeDefined()
    expect(typeof event === 'string').toBe(true)
    expect(subscribe).toBeDefined()
    expect(typeof subscribe === 'function').toBe(true)
  })

  it('should handle an event with the subscribe function', () => {
    let mockEventData = {
      data: {
        item: {
          todo: 'write this test',
          completed: true
        }
      }
    }

    let done = jest.fn()

    subscribe(mockEventData, done)

    expect(done).toBeCalled()
  })
})
