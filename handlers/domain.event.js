export const event = 'domain.event'

export const subscribe = function (event, cb) {
  const { id, product } = event.data
  // do something
  cb()
}
