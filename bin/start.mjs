#!/bin/sh
':' // # patrickleet ; exec /usr/bin/env node --experimental-modules "$0" "$@"

import path from 'path'

import log from 'llog'
import errortrap from 'errortrap'
import registerHandlers from 'servicebus-register-handlers'
import servicebus from 'servicebus-bus-common'
import { config } from '../config.mjs'
import api from 'express-api-common'
import mongoClient from 'sourced-repo-mongo/mongo'

// 🔥 Welcome to my opinionated servicebus boilerplate! 🔥

// This is an example of a "model" service, because that is the most complex :)
// This model service doesn't need an API, so in reality, I'd delete that after using this as a template
// but it's here so you have a working example for some services that you might want an API for
//
// More info:
// https://hackernoon.com/learning-these-5-microservice-patterns-will-make-you-a-better-engineer-52fc779c470a

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
    await mongoClient.connect(config.mongo.url)
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
  const bus = await servicebus.makeBus(config)
  const { queuePrefix } = config

  // Register's all of the files in the folder specified as `path`
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
  await registerHandlers({
    bus,
    path: path.resolve(process.cwd(), 'handlers'),
    modules: true,
    queuePrefix
  })

  //
  // you probably won't need a api/server for most services,
  // but there definitely are use cases for them.
  //
  // I wanted you to have a good example of how to do so:
  //
  // "express-api-common" simply creates an express server using commonly
  // used express middleware, such as prometheus exporters
  // for autoscaling purposes
  //
  // "log" is an instance of llog, a "leveled logger".
  // It's actually just logging with pino, but it is a singleton
  // so you don't need to create it elsewhere, which can throw off your logs
  // by saying the file it came from is the singleton file, which is much less helpful!
  //
  // I'm assuming your logging strategy is "log to stdout" and pick it up with an external tool.
  // Microservices shouldn't have to care about shipping logs.
  //
  const server = api.makeServer({
    logger: log
  })
  server.start(config.PORT, onStart)
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
