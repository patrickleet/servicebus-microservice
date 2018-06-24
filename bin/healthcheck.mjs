#!/bin/sh
':' // # by https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$@"

import amqplib from 'amqplib'

export const exit = ({healthy = true} = {}) => {
  return healthy ? process.exit(0) : process.exit(1)
}

export const open = amqplib.connect(process.env.RABBITMQ_URL)

export const handleSuccessfulConnection = (healthcheck) => {
  return () => {
    healthcheck({healthy: true})
  }
}

export const handleUnsuccessfulConnection = (healthcheck) => {
  return (e) => {
    healthcheck({healthy: false})
  }
}

open
  .then(handleSuccessfulConnection(exit))
  .catch(handleUnsuccessfulConnection(exit))
