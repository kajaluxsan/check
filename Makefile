

.PHONY: start stop restart build logs clean

start:
	docker compose up -d
	@echo "App läuft auf http://localhost:3000"

stop:
	docker compose down

restart: stop start

build:
	docker compose build --no-cache

logs:
	docker compose logs -f

clean:
	docker compose down -v --rmi local
