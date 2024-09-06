NAME=transcendance
DOCC=docker-compose
DOCKER_PATH=/usr/bin/docker-compose

all: build up

build:
	$(DOCC) -f ./$(DOCC).yml build

up:
	$(DOCC) -f ./$(DOCC).yml up -d


down:
	$(DOCC) -f ./$(DOCC).yml down

re: fclean build up

fclean:
	docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq) && docker volume rm $$(docker volume ls -q) && docker rmi $$(docker images -q)
	docker network prune
	docker system prune -a

logs:
	docker-compose logs app nginx postgres_db

.PHONY:all build up start down re fclean
