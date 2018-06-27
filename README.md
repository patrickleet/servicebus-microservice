# todolist-model-service

## Explore the Code

`./bin/start.mjs`
* Starts the application:
  1. Configures a bus
  1. Registers command/event handlers with `servicebus-register-handlers`
  1. (Optionally) Configures an API server
  1. Starts the API server
* You shouldn't have to do much here except maybe configure a server if you want to or apply custom middleware
* If you find the "common" settings don't work for you, it's easy to use your own!

`./handlers/*`
* Event and command handlers
  * Events are "published" with `bus.publish`, and services can `subscribe` to those events
  * Commands are "sent" with `bus.send`, and services can `listen` for those commands
* Imported/Required by `servicebus-register-handlers` when the service starts

`./config.mjs`
* Using `cconfig` for configuration
  * A "cascading configuration" tool
  * env variables are applied on top of default config
  * can configure environment specific configs as well

That's it! The rest is tooling.

```
helm install --namespace servicebus stable/rabbitmq
helm install --namespace servicebus stable/redis
helm install --namespace todolist --name sourced-db  stable/mongodb\
  --set mongodbRootPassword=asecretpassword,mongodbUsername=username,mongodbPassword=apassword,mongodbDatabase=sourced \
    stable/mongodb
```
