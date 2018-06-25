import SourcedRepoMongo from 'sourced-repo-mongo'
import TodoList from '../models/TodoList'
import Queued from 'sourced-queued-repo'

const { Repository } = SourcedRepoMongo

const repository = new Repository(TodoList)

export const todoListRepository = Queued(repository)
