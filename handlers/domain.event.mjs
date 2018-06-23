export const event = 'inventory.product.updated'

export const subscribe = function (event, done) {
  const { product } = event.data
  // do something
  done()
}
