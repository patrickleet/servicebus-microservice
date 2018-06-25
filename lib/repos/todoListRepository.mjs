import Bluebird from 'bluebird'
import SourcedRepoMongo from 'sourced-repo-mongo'
import { TodoList } from '../models/TodoList'
import Queued from 'sourced-queued-repo'

const { Repository } = SourcedRepoMongo

const repository = new Repository(TodoList)

const queuedRepository = Queued(repository)

export const todoListRepository = Bluebird.promisifyAll(queuedRepository)
