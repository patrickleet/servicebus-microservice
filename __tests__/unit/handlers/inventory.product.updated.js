import { event, subscribe } from 'inventory.product.updated.mjs'

describe('The inventory.product.updated event handler', () => {
  it('should exist', () => {
    expect(event).toBeDefined()
    expect(typeof event === 'string').toBe(true)
    expect(subscribe).toBeDefined()
    expect(typeof subscribe === 'function').toBe(true)
  })

  it('should handle an event with the subscribe function', () => {
    let mockEventData = {
      data: {
        product: {
          title: 'Shirt',
          quantity: 10
        }
      }
    }

    let done = jest.fn()

    subscribe(mockEventData, done)

    expect(done).toBeCalled()
  })
})