.PHONY: dev build start install clean help

# Development - run both frontend and backend
dev:
	npm run dev

# Build all projects
build:
	npm run build

# Production start
start:
	npm run start

# Install all dependencies
install:
	npm install

# Clean node_modules and build artifacts
clean:
	rm -rf node_modules/
	rm -rf frontend/node_modules/
	rm -rf backend/node_modules/
	rm -rf shared/node_modules/
	rm -rf frontend/dist/
	rm -rf backend/dist/
	rm -rf shared/dist/
	rm -f backend/dev.db

# Install and setup everything from scratch
setup: clean install
	cd shared && npm run build
	cd backend && npx prisma generate && npx prisma db push

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make dev     - Start development servers (frontend + backend)"
	@echo "  make build   - Build all projects for production"
	@echo "  make start   - Start production server"
	@echo "  make install - Install dependencies"
	@echo "  make clean   - Clean all build artifacts and dependencies"
	@echo "  make setup   - Full setup from scratch (clean + install + build + db)"
	@echo "  make help    - Show this help message"