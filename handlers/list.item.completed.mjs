import log from 'llog'

export const event = 'list.item.completed'

export const subscribe = function ({ type, datetime, data }, done) {
  const { item } = data
  const { todo, complete } = item

  log.info({msg: `executing listen handler for ${event}`, event, todo, complete, type, datetime})
  // do something
  done()
}
