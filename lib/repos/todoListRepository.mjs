import Bluebird from 'bluebird'
import SourcedRepoMongo from 'sourced-repo-mongo'
import Queued from 'sourced-queued-repo'
import { TodoList } from '../models/TodoList.mjs'

const { Repository } = SourcedRepoMongo

const repository = new Repository(TodoList)

const queuedRepository = Queued(repository)

export const todoListRepository = Bluebird.promisifyAll(queuedRepository)
