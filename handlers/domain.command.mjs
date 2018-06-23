export const command = 'inventory.product.addToInventory'

export const listen = function (command, done) {
  const { product } = command.data
  // do something
  done()
}
