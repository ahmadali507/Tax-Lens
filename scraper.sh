#!/bin/bash

# Pakistani Government Projects Web Scraper
# This script helps manage and run the project scraper

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if dependencies are installed
check_dependencies() {
    print_header "Checking Dependencies"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js is installed ($(node -v))"
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm is installed ($(npm -v))"
    
    if ! npx -v &> /dev/null; then
        print_error "npx is not working"
        exit 1
    fi
    print_success "npx is available"
}

# Install scraper dependencies
install_dependencies() {
    print_header "Installing Scraper Dependencies"
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing packages..."
        npm install axios cheerio --save
        npm install --save-dev @types/node ts-node typescript
        print_success "Dependencies installed"
    else
        print_info "node_modules already exists, skipping..."
    fi
}

# Run the scraper
run_scraper() {
    print_header "Running Pakistani Projects Scraper"
    
    if [ ! -f "scripts/scrape-projects.ts" ]; then
        print_error "Scraper script not found at scripts/scrape-projects.ts"
        exit 1
    fi
    
    print_info "Starting scraper..."
    
    # Use tsx which is more reliable for TypeScript execution
    npx tsx scripts/scrape-projects.ts
    
    if [ $? -eq 0 ]; then
        print_success "Scraper completed successfully"
        print_info "Data saved to src/data/scraped-projects.ts"
    else
        print_error "Scraper failed"
        exit 1
    fi
}

# View generated data
view_data() {
    print_header "Generated Project Data"
    
    if [ -f "src/data/scraped-projects.ts" ]; then
        echo ""
        head -50 src/data/scraped-projects.ts
        echo ""
        print_info "Showing first 50 lines. Full file at: src/data/scraped-projects.ts"
    else
        print_warning "No generated data found yet. Run the scraper first."
    fi
}

# Show statistics
show_stats() {
    print_header "Project Statistics"
    
    if [ ! -f "src/data/scraped-projects.ts" ]; then
        print_warning "No generated data found. Run the scraper first."
        return
    fi
    
    # Count projects by status
    local ongoing=$(grep -c '"status": "ongoing"' src/data/scraped-projects.ts || echo 0)
    local completed=$(grep -c '"status": "completed"' src/data/scraped-projects.ts || echo 0)
    local planned=$(grep -c '"status": "planned"' src/data/scraped-projects.ts || echo 0)
    local cancelled=$(grep -c '"status": "cancelled"' src/data/scraped-projects.ts || echo 0)
    
    echo ""
    echo "Project Status Breakdown:"
    echo "  🟢 Ongoing:    $ongoing"
    echo "  ✅ Completed:  $completed"
    echo "  🟡 Planned:    $planned"
    echo "  ❌ Cancelled:  $cancelled"
    echo ""
}

# Clean generated data
clean_data() {
    print_header "Cleaning Generated Data"
    
    if [ -f "src/data/scraped-projects.ts" ]; then
        rm src/data/scraped-projects.ts
        print_success "Removed src/data/scraped-projects.ts"
    fi
}

# Show help
show_help() {
    cat << EOF
${BLUE}Pakistani Government Projects Web Scraper${NC}
${BLUE}===========================================${NC}

Usage: ./scraper.sh [command]

Commands:
  install       Install required dependencies
  run          Run the scraper and generate project data
  view         View the generated project data
  stats        Show project statistics
  clean        Remove generated data files
  all          Install deps, run scraper, and show stats (recommended)
  help         Show this help message

Examples:
  ./scraper.sh install     # Install dependencies
  ./scraper.sh run         # Run the scraper
  ./scraper.sh all         # Do everything
  ./scraper.sh stats       # Show statistics

EOF
}

# Main script
main() {
    local command=${1:-help}
    
    case $command in
        install)
            check_dependencies
            install_dependencies
            ;;
        run)
            run_scraper
            ;;
        view)
            view_data
            ;;
        stats)
            show_stats
            ;;
        clean)
            clean_data
            ;;
        all)
            check_dependencies
            install_dependencies
            run_scraper
            show_stats
            echo ""
            print_success "All tasks completed!"
            echo ""
            print_info "Next steps:"
            echo "  1. Review the generated data: ./scraper.sh view"
            echo "  2. Update your projects page to use the scraped data"
            echo "  3. Check INTEGRATION_GUIDE.md for implementation examples"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
