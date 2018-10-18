import log from 'llog'
import { TodoList } from '../lib/models/TodoList'
import { todoListRepository } from '../lib/repos/todoListRepository.mjs'

export const command = 'list.item.add'

log.info({ msg: `registering ${command}`, command })

//
// WARNING: You can not use an () => {} function here, because the context
// that contains the bus will not be bound properly!
//
export const listen = async function ({ type, data, datetime }, done) {
  try {
    const { bus } = this
    const { todoListId, item } = data
    const { todo, complete } = item

    if (!todoListId) throw new Error(`${command} - todoListId must be defined!`)

    // JSON logging
    // Great for filtering in Kibana
    log.info({ msg: `executing listen handler for ${command}`, command, todo, complete, type, datetime })

    // do something, if it's a model, probably with a repository pattern
    //  * I'm using sourced, and sourced-repo-mongo in this example

    let todoList

    try {
      todoList = await todoListRepository.getAsync(todoListId)
    } catch (err) {
      log.error('Error calling todoListRepository.getAsync')
      log.error(err)
      throw new Error({ name: 'ERROR_GET_ASYNC' })
    }

    if (!todoList) {
      todoList = new TodoList()

      todoList.initialize({
        id: todoListId
      })
    }

    todoList.addItem(item)

    await todoListRepository.commitAsync(todoList)

    bus.publish('list.item.added', item)
    log.info({ msg: 'list.item.added', item })

    done()

  } catch (err) {
    log.error(err)
    done(`Command Handler Failed for ${command} - ${err}`)
  }
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
