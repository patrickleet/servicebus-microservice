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
    let mockCommandData = {
      data: {
        item: {
          todo: 'write this test',
          completed: false
        }
      }
    }

    let done = jest.fn()

    listen(mockCommandData, done)

    expect(done).toBeCalled()
  })
})
