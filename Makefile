install:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm install

start:
	docker-compose up -d

setup:
	make restore-db

docker-build:
	docker build -t microservice .

ci:
	rm -rf node_modules
	COMPOSE_FILE=./docker-compose/builder.yml \
	PORT=3000 \
		make	docker-build \
					clean \
					install \
					staging \
					staging-down

clean:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm clean

lint:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm lint

unit-tests:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm unit-tests

watch-tests:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm watch-tests

build:
	COMPOSE_FILE=./docker-compose/builder.yml \
	NODE_ENV=production \
		docker-compose run --rm build

npmClean:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm npmClean

installProdOnly:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm installProdOnly

installDevOnly:
	COMPOSE_FILE=./docker-compose/builder.yml \
		docker-compose run --rm installDevOnly

staging:
	COMPOSE_FILE=./docker-compose/staging.yml \
		docker-compose up -d rabbitmq redis mongo
	sleep 10
	COMPOSE_FILE=./docker-compose/staging.yml \
		docker-compose up -d staging-deps
	sleep 10
	make run-staging-tests

run-staging-tests:
	COMPOSE_FILE=./docker-compose/staging.yml \
		docker-compose run --rm staging

staging-down:
	COMPOSE_FILE=./docker-compose/staging.yml \
		docker-compose down --remove-orphans
