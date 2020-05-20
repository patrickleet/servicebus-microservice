#!/bin/sh
':' //# https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$1"

import path from 'path'

import log from 'llog'
import errortrap from 'errortrap'
import registerHandlers from '@servicebus/register-handlers'
import servicebus from 'servicebus-bus-common'
import { config } from '../config.mjs'
import mongoClient from 'sourced-repo-mongo/mongo.js'

// 🔥 Welcome to my opinionated servicebus boilerplate! 🔥

// errortrap logs uncaught exceptions with llog before
// throwing an error
errortrap()

export const start = async (onStart) => {
  // "Model services" need persistence.
  //
  // AKA, a database.
  //
  // We'll use MongoDB, cause that's what is most implemented
  // as a sourced repository.
  //
  // For now, we just need to set up the mongodb client
  log.info('connecting to mongo')
  try {
    await mongoClient.connect(config.sourced.mongo.url)
  } catch (err) {
    log.error(err)
    throw new Error('Error connecting to mongo')
  }
  log.info('connected to mongo')

  // `servicebus-bus-common.makeBus` creates a new instance of servicebus.bus
  // using commonly used servicebus middleware
  //
  // Servicebus is kinda lika an event emitter for your whole system.
  // You can emit an event in one service. Then you can listen for that event in another service.
  // It is also fault tolerant and scalable.
  // It's backed by RabbitMQ and Redis.
  // It's been used in production for years in financial transactions with large volumes, AI projects
  // and at least one blockchain based company.
  //
  // bus's have 4 main functions - send/listen for command and publish/subscribe for events
  //
  // It's also great for building systems with CQRS/ES.
  // Command Query Responsibility Segregation with Event Sourcing.
  //
  // Here's a really great video about it from the library's author, and good friend Matt Walters:
  // https://www.youtube.com/watch?v=4k7bLtqXb8c
  //
  log.info('connecting to servicebus')
  const bus = await servicebus.makeBus(config.servicebus)
  log.info('connected to servicebus')

  // Next we need to register the "handlers" with the bus.
  //
  // Handlers are the special sauce of microservices
  //
  // They respond to messages.
  //
  // Messages can be either a command or an event.
  //
  // # Commands
  //
  // If you want to define a command handler, you create a file with the name of the command...
  // it can actually be anything so I guess if you're a sadist you can name it whatever you want!
  //
  // That file is a "module". Which is especially clear given the .mjs extensions everywhere.
  //
  // A command module *must* have two named exports: `command` and `listen`
  //
  // `command` is the command you are listening for. Just a string. Nothing fancy. "list.item.add"
  //
  // A good command name is just getting less specific with each dot.
  //
  // Start with the broad scope, the "Aggregate" - "list"
  // What is the "entity" - "item"
  // And what is the command regarding the item? "add"
  //
  // You can get more broad or specific as needed with more or less dots.
  //
  // `listen` is a Handler. Specifically, a command handler. It's a function that receives the command,
  // and handles it.
  //
  // Other services elsewhere in your system will use their bus to `send` commands, that other
  // services can `listen` for.
  //
  // Usually, it will want to brag about what it's done to the rest of the services, so it will
  // `publish` an event with the details with `bus.publish('event.happened', { ...eventDetails })`
  //
  // # Events
  //
  // To define an event handler there will also be two exports: `event` and `subscribe`
  //
  // `event` is the name of the event: 'event.happened'
  //
  // `subscribe` is the Handler for the event. The "Event Handler".
  //
  // registerHandlers registers all of your handlers from the folder specified.
  //
  log.info('registering handlers')
  const { queuePrefix } = config.servicebus
  await registerHandlers({
    bus,
    path: path.resolve(process.cwd(), 'handlers'),
    modules: true,
    queuePrefix
  })
  log.info('registered handlers')

  onStart()
}

export const onStart = () => { log.info('server is running') }
start(onStart)

// Check out my blog for more resources!
// https://medium.com/@patrickleet
//
// Related Articles:
// https://hackernoon.com/what-makes-a-microservice-architecture-14c05ad24554
// https://codeburst.io/serverless-ish-a-scaling-story-5732945b93ab
//
