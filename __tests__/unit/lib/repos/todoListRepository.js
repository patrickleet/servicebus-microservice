import { todoListRepository } from 'repos/todoListRepository.mjs'

jest.mock('sourced-repo-mongo', () => {
  return {
    Repository: jest.fn()
  }
})

jest.mock('sourced', () => {
  const EventEmitter = require('events')
  return {
    SourcedEntity: class SourcedEntity extends EventEmitter {
      constructor () {
        super()
        this.digest = jest.fn()
      }
    }
  }
})

describe('repos/todoListRepository', () => {
  it('is a singleton', () => {
    const repo = require('sourced-repo-mongo')

    const todoListRepository2 = require('repos/todoListRepository.mjs').todoListRepository
    const todoListRepository3 = require('repos/todoListRepository.mjs').todoListRepository

    expect(repo.Repository).toHaveBeenCalledTimes(1)
    expect(todoListRepository).toBeDefined()
    expect(todoListRepository).toBe(todoListRepository2)
    expect(todoListRepository2).toBe(todoListRepository3)
  })
})
