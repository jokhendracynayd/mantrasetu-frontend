#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Configuration
COMPOSE_FILE="docker-compose.dev.yml"
CONTAINER_NAME="mantrasetu-frontend-dev"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

print_error() {
    echo -e "${RED}✗ ${NC}$1"
}

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}  MantraSetu Frontend Development Environment${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

# Function to check if container is running
is_running() {
    docker ps --filter "name=$CONTAINER_NAME" --filter "status=running" --format "{{.Names}}" | grep -q "$CONTAINER_NAME"
}

# Function to start the development server
start_dev() {
    print_info "Starting frontend development server..."
    
    if is_running; then
        print_warning "Frontend is already running! Stopping first..."
        docker-compose -f "$COMPOSE_FILE" down
        sleep 2
    fi
    
    # Build and start in detached mode
    docker-compose -f "$COMPOSE_FILE" up --build -d
    
    if [ $? -eq 0 ]; then
        print_success "Frontend development server started successfully!"
        print_info "Container: $CONTAINER_NAME"
        print_info "URL: http://localhost:3000"
        print_info "Hot reload: Enabled"
        
        # Ask if user wants to view logs
        echo ""
        read -p "Do you want to view logs now? (y/n): " view_logs
        if [[ "$view_logs" =~ ^[Yy]$ ]]; then
            show_logs
        else
            print_info "To view logs later, run: ./docker-dev.sh logs"
        fi
    else
        print_error "Failed to start frontend development server"
        exit 1
    fi
}

# Function to stop the development server
stop_dev() {
    print_info "Stopping frontend development server..."
    
    if ! is_running; then
        print_warning "Frontend is not running!"
        return
    fi
    
    docker-compose -f "$COMPOSE_FILE" down
    
    if [ $? -eq 0 ]; then
        print_success "Frontend development server stopped"
    else
        print_error "Failed to stop frontend development server"
        exit 1
    fi
}

# Function to restart the development server
restart_dev() {
    print_info "Restarting frontend development server..."
    stop_dev
    sleep 2
    start_dev
}

# Function to show logs
show_logs() {
    if ! is_running; then
        print_error "Frontend is not running!"
        exit 1
    fi
    
    print_info "Showing logs (Press Ctrl+C to exit)..."
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Function to rebuild (clean build)
rebuild_dev() {
    print_info "Rebuilding frontend (clean build)..."
    
    docker-compose -f "$COMPOSE_FILE" down -v
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    docker-compose -f "$COMPOSE_FILE" up -d
    
    if [ $? -eq 0 ]; then
        print_success "Frontend rebuilt successfully!"
        
        # Ask if user wants to view logs
        echo ""
        read -p "Do you want to view logs now? (y/n): " view_logs
        if [[ "$view_logs" =~ ^[Yy]$ ]]; then
            show_logs
        fi
    else
        print_error "Failed to rebuild frontend"
        exit 1
    fi
}

# Function to show status
show_status() {
    print_info "Frontend Development Server Status:"
    echo ""
    
    if is_running; then
        print_success "Status: Running"
        docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_warning "Status: Stopped"
    fi
}

# Function to execute shell in container
exec_shell() {
    if ! is_running; then
        print_error "Frontend is not running!"
        exit 1
    fi
    
    print_info "Opening shell in container..."
    docker exec -it "$CONTAINER_NAME" /bin/sh
}

# Function to clean up (remove volumes, images)
cleanup() {
    print_warning "This will remove all frontend containers, volumes, and images!"
    read -p "Are you sure? (y/n): " confirm
    
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        print_info "Cleaning up..."
        docker-compose -f "$COMPOSE_FILE" down -v --rmi all --remove-orphans
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Function to show help
show_help() {
    print_header
    echo "Usage: ./docker-dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start        Start the development server (with hot reload)"
    echo "  stop         Stop the development server"
    echo "  restart      Restart the development server"
    echo "  logs         Show and follow logs"
    echo "  rebuild      Clean rebuild (removes cache)"
    echo "  status       Show container status"
    echo "  shell        Open shell in container"
    echo "  cleanup      Remove all containers, volumes, and images"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-dev.sh start    # Start dev server"
    echo "  ./docker-dev.sh logs     # View logs"
    echo "  ./docker-dev.sh restart  # Restart server"
    echo ""
    echo "Features:"
    echo "  ✓ Hot reload enabled - changes reflect automatically"
    echo "  ✓ ESLint disabled for clean output"
    echo "  ✓ Volume mounted for live code updates"
    echo "  ✓ Interactive log viewing options"
    echo ""
}

# Main script logic
case "$1" in
    start)
        print_header
        start_dev
        ;;
    stop)
        print_header
        stop_dev
        ;;
    restart)
        print_header
        restart_dev
        ;;
    logs)
        show_logs
        ;;
    rebuild)
        print_header
        rebuild_dev
        ;;
    status)
        print_header
        show_status
        ;;
    shell)
        exec_shell
        ;;
    cleanup)
        print_header
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac

