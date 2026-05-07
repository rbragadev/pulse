.PHONY: install dev backend frontend db-up db-down db-migrate seed lint build help

help: ## Mostra esta mensagem de ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instala dependências do backend e frontend
	@echo "📦 Instalando dependências..."
	cd backend && npm install
	cd frontend && npm install
	@echo "✅ Dependências instaladas!"

dev: ## Sobe o banco e inicia backend + frontend em paralelo
	@echo "🚀 Iniciando Pulse em modo desenvolvimento..."
	make db-up
	@sleep 2
	make db-migrate
	@trap 'kill 0' INT; \
	cd backend && npm run start:dev & \
	cd frontend && npm run dev & \
	wait

backend: ## Inicia apenas o backend
	@echo "🔧 Iniciando backend..."
	cd backend && npm run start:dev

frontend: ## Inicia apenas o frontend
	@echo "🎨 Iniciando frontend..."
	cd frontend && npm run dev

db-up: ## Sobe o PostgreSQL via Docker
	@echo "🐘 Subindo PostgreSQL..."
	docker compose up postgres -d
	@echo "✅ PostgreSQL rodando na porta 5432"

db-down: ## Para o PostgreSQL
	docker compose down

db-migrate: ## Executa as migrations do Prisma
	@echo "🗄️  Executando migrations..."
	cd backend && npx prisma migrate dev --name init
	@echo "✅ Migrations executadas!"

db-generate: ## Gera o Prisma Client
	@echo "⚙️  Gerando Prisma Client..."
	cd backend && npx prisma generate

seed: ## Popula o banco com dados mockados
	@echo "🌱 Populando banco com dados de exemplo..."
	cd backend && npm run prisma:seed
	@echo "✅ Seed concluído!"

lint: ## Executa linting em backend e frontend
	@echo "🔍 Executando lint..."
	cd backend && npm run lint
	cd frontend && npm run lint

build: ## Build de produção
	@echo "🏗️  Gerando build de produção..."
	cd backend && npm run build
	cd frontend && npm run build
	@echo "✅ Build concluído!"

docker-up: ## Sobe todos os serviços Docker
	@echo "🐳 Subindo todos os serviços..."
	docker compose up -d
	@echo "✅ Serviços rodando!"

docker-down: ## Para todos os serviços Docker
	docker compose down

docker-logs: ## Mostra logs dos containers
	docker compose logs -f

setup: ## Setup inicial completo (instalar + banco + migrate + seed)
	@echo "🎯 Setup inicial do Pulse..."
	make install
	make db-up
	@sleep 3
	make db-migrate
	make seed
	@echo ""
	@echo "✅ Pulse pronto para uso!"
	@echo "👉 Execute 'make dev' para iniciar"
