import { start, onStart } from 'start.mjs'
jest.mock('llog')
jest.mock('errortrap', () => jest.fn())
jest.mock('@servicebus/register-handlers')
jest.mock('servicebus-bus-common')
jest.mock('../../../config.mjs')
// jest.mock('sourced-repo-mongo')
jest.mock('sourced-repo-mongo/mongo')

describe('./bin/start.mjs', () => {
  it('should start our todolist-model-service', () => {
    const errortrap = require('errortrap')
    const log = require('llog')

    start()
    expect(errortrap).toBeCalled()

    onStart()
    expect(log.info).toBeCalled()
  })

  it('should throw an error if it cant connect to mongo', () => {
    const mongoClient = require('sourced-repo-mongo/mongo')
    mongoClient.connect = jest.fn(() => new Promise((resolve, reject) => { reject(new Error('MongoDB Error')) }))
    const onStart = jest.fn()
    expect(start(onStart)).rejects.toEqual(new Error('Error connecting to mongo'))
    expect(onStart).not.toBeCalled()
  })
})
