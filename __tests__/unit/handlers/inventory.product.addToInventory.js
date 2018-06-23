import { command, listen } from 'inventory.product.addToInventory.mjs'

describe('The inventory.product.addToInventory command handler', () => {
  it('should exist', () => {
    expect(command).toBeDefined()
    expect(typeof command === 'string').toBe(true)
    expect(listen).toBeDefined()
    expect(typeof listen === 'function').toBe(true)
  })

  it('should handle an command with the listen function', () => {
    let mockCommandData = {
      data: {
        product: {
          title: 'Shirt',
          quantity: 10
        }
      }
    }

    let done = jest.fn()

    listen(mockCommandData, done)

    expect(done).toBeCalled()
  })
})