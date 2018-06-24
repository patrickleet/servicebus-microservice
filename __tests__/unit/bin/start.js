jest.mock('llog')
jest.mock('errortrap', () => jest.fn())
jest.mock('servicebus-register-handlers')
jest.mock('servicebus-bus-common')
jest.mock('../../../config.mjs')
jest.mock('express-api-common', () => ({
  makeServer: jest.fn(() => ({
    start: jest.fn()
  }))
}))

describe('./bin/start.mjs', () => {
  it('should start our microservice', () => {
    let errortrap = require('errortrap')

    let start = require('start.mjs')
    expect(errortrap).toBeCalled()

    start.onStart()
  })
})
