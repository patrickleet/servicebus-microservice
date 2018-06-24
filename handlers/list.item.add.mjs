import log from 'llog'

export const command = 'list.item.add'

log.info({msg: `registering ${command}`, command})

export const listen = function ({ type, data, datetime }, done) {
  const { bus } = this
  const { item } = data
  const { todo, complete } = item

  log.debug({msg: 'DEBUG', that: this})

  // JSON logging
  // Great for filtering in Kibana
  log.info({msg: `executing listen handler for ${command}`, command, todo, complete, type, datetime})

  // do something, if it's a model, probably with a repository pattern
  //  * check out sourced, and sourced-repo-mongo
  //  * something like...
  //
  // import listRepository from './listRepository'
  // import ListModel from './List' ** ^ but up top
  //
  // listRepository.get(id, (err, list) => {
  //   if (err) return cb(err)
  //   if (!list) {
  //     list = new InventoryModel()
  //     list.initialize({
  //       id
  //     })
  //   }
  //   list.addItem({ item })
  //
  //  // verify work done before committing
  //
  //   listRepository.commit(list, () => {
  //     done()
  //   })
  // }
  //
  //

  bus.publish('list.item.added')

  done()
}

// meanwhile... in another service...
//
// bus.send('list.item.add', {
//   item: {
//     todo: "Make this",
//     complete: false
//   }
// })
//
//
