DEV_ENV_FILE=../../api/.env.dev
PROD_ENV_FILE=../../api/.env.prod

DEV_COMPOSE_FILE=docker-compose-dev.yml
PROD_COMPOSE_FILE=docker-compose-prod.yml


### DEVELOPMENT DOCKER COMMANDS

# Use after making change to Dockerfile or change package.json 
.PHONY: compose-build 
compose-build:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) build

# Use to creare a container, start and attach logs
.PHONY: compose-up 
compose-up:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) up

# Use to creare a container, start and attach logs in background
.PHONY: compose-up-d 
compose-up-d:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) up -d

# Use when editing Dockefile and app code - docker compose build + docker compose up in one command.
.PHONY: compose-up-build 
compose-up-build:
	docker compose --env-file $(DEV_ENV_FILE) -f $(DEV_COMPOSE_FILE) up --build

# Use to stop and remove containers, networks, and (by default) anonymous volumes
.PHONY: compose-down 
compose-down:
	docker compose -f $(DEV_COMPOSE_FILE) down

###


### DOCKER DB COMMANDS
.PHONY: exec-mongo-dev 
compose-up-d:
	docker exec -it mongo-dev mongosh -u dev -p devpass --authenticationDatabase admin
###


### DEVELOPMENT DOCKER COMMANDS
.PHONY: prod-up-core
prod-up-core:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) up -d db mongo-init-replica

.PHONY: prod-seed
prod-seed:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) run --rm seed

.PHONY: prod-up
prod-up:
	docker compose --env-file $(PROD_ENV_FILE) -f $(PROD_COMPOSE_FILE) up -d api-node
###
