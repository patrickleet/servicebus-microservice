export const command = 'domain.command'

export const listen = function (command, cb) {
  const { id, product } = command.data
  // do something
  cb()
}
