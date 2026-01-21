#!/bin/bash

# Script to add PHPDoc comments to all PHP files in Laravel project
# This script will scan all PHP files and add comprehensive comments

echo "Starting to add PHPDoc comments to all PHP files..."

# Function to add comments to a PHP file
add_comments_to_file() {
    local file="$1"
    echo "Processing: $file"

    # Skip if file already has class comments
    if grep -q "/\*\*" "$file"; then
        echo "  Skipping - already has comments"
        return
    fi

    # Get file type from path
    if [[ "$file" == *"Controller.php" ]]; then
        add_controller_comments "$file"
    elif [[ "$file" == *"Service.php" ]]; then
        add_service_comments "$file"
    elif [[ "$file" == *"Repository.php" ]]; then
        add_repository_comments "$file"
    elif [[ "$file" == *"Request.php" ]]; then
        add_request_comments "$file"
    elif [[ "$file" == *"Model.php" ]]; then
        add_model_comments "$file"
    elif [[ "$file" == *"ServiceProvider.php" ]]; then
        add_service_provider_comments "$file"
    elif [[ "$file" == *"RepositoryInterface.php" ]]; then
        add_repository_interface_comments "$file"
    elif [[ "$file" == *"Event.php" ]] || [[ "$file" == *"/Events/"* ]]; then
        add_event_comments "$file"
    elif [[ "$file" == *"Observer.php" ]]; then
        add_observer_comments "$file"
    elif [[ "$file" == *"Entity.php" ]] || [[ "$file" == *"/Entities/"* ]]; then
        add_entity_comments "$file"
    elif [[ "$file" == *"Command.php" ]]; then
        add_command_comments "$file"
    elif [[ "$file" == *"Job.php" ]]; then
        add_job_comments "$file"
    elif [[ "$file" == *"routes/api.php" ]]; then
        echo "  Skipping - route file"
        return
    elif [[ "$file" == *"/Routes/"* ]] && [[ "$file" == *".php" ]]; then
        echo "  Skipping - route file"
        return
    elif [[ "$file" == *"/Cache/"* ]] && [[ "$file" == *".php" ]]; then
        add_cache_comments "$file"
    elif [[ "$file" == *"/Console/Commands/"* ]] && [[ "$file" == *".php" ]]; then
        add_command_comments "$file"
    else
        echo "  Unknown file type - skipping"
    fi
}

# Add comments to Controller files
add_controller_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)
    local namespace=$(grep "namespace" "$file" | head -1 | sed 's/namespace //' | sed 's/;.*//')

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Controller for handling API endpoints\\
 * Provides REST API operations\\
 */" "$file" > "$temp_file"

    # Add constructor comment
    sed -i '' "/public function __construct(/i\\
    /**\\
     * ${class_name} constructor.\\
     *\\
     * @param mixed \$service Service instance for business logic\\
     */" "$temp_file"

    # Add method comments for common methods
    sed -i '' "/public function index(/i\\
    /**\\
     * Get paginated list of items\\
     *\\
     * @return \\\\Illuminate\\\\Http\\\\JsonResponse Response containing paginated data\\
     */" "$temp_file"

    sed -i '' "/public function store(/i\\
    /**\\
     * Create a new item\\
     *\\
     * @param mixed \$request Request object containing validated data\\
     * @return \\\\Illuminate\\\\Http\\\\JsonResponse Response containing created item\\
     */" "$temp_file"

    sed -i '' "/public function show(/i\\
    /**\\
     * Get a specific item by identifier\\
     *\\
     * @param string \$id Item identifier\\
     * @return \\\\Illuminate\\\\Http\\\\JsonResponse Response containing item data\\
     */" "$temp_file"

    sed -i '' "/public function update(/i\\
    /**\\
     * Update an existing item\\
     *\\
     * @param mixed \$request Request object containing validated data\\
     * @param string \$id Item identifier\\
     * @return \\\\Illuminate\\\\Http\\\\JsonResponse Response containing updated item\\
     */" "$temp_file"

    sed -i '' "/public function destroy(/i\\
    /**\\
     * Delete an item by identifier\\
     *\\
     * @param string \$id Item identifier\\
     * @return \\\\Illuminate\\\\Http\\\\JsonResponse Response indicating deletion result\\
     */" "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Service files
add_service_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Service layer for handling business logic\\
 * Provides CRUD operations and business rules\\
 */" "$file" > "$temp_file"

    # Add constructor comment
    sed -i '' "/public function __construct(/i\\
    /**\\
     * ${class_name} constructor.\\
     *\\
     * @param mixed \$repo Repository instance for data operations\\
     */" "$temp_file"

    # Add method comments
    sed -i '' "/public function list(/i\\
    /**\\
     * Get paginated list of items\\
     *\\
     * @param int \$perPage Number of items per page\\
     * @return mixed Paginated list of items\\
     */" "$temp_file"

    sed -i '' "/public function findBySlug(/i\\
    /**\\
     * Find item by slug\\
     *\\
     * @param string \$slug Item slug\\
     * @return mixed|null Item object or null if not found\\
     */" "$temp_file"

    sed -i '' "/public function create(/i\\
    /**\\
     * Create a new item\\
     *\\
     * @param array \$data Item data to create\\
     * @return mixed Created item object\\
     */" "$temp_file"

    sed -i '' "/public function update(/i\\
    /**\\
     * Update an existing item\\
     *\\
     * @param string \$slug Item slug\\
     * @param array \$data Data to update\\
     * @return mixed Updated item object\\
     */" "$temp_file"

    sed -i '' "/public function delete(/i\\
    /**\\
     * Delete an item by slug\\
     *\\
     * @param string \$slug Item slug\\
     * @return bool True if successful, false otherwise\\
     */" "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Repository files
add_repository_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Interface ${class_name}\\
 *\\
 * Repository interface for data access operations\\
 * Defines contract for data layer implementations\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Request files
add_request_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Request validation class\\
 * Handles input validation and authorization\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Model files
add_model_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Eloquent model for database table\\
 * Handles database operations and relationships\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to ServiceProvider files
add_service_provider_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Service provider for registering services and bindings\\
 * Handles dependency injection and service registration\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to RepositoryInterface files
add_repository_interface_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add interface comment
    sed "1a\\
/**\\
 * Interface ${class_name}\\
 *\\
 * Repository interface for data access operations\\
 * Defines contract for data layer implementations\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Event files
add_event_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Event class for broadcasting domain events\\
 * Contains event data and can be listened to by listeners\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Observer files
add_observer_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Model observer for handling model events\\
 * Automatically triggers actions on model lifecycle events\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Entity files
add_entity_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Domain entity representing business object\\
 * Contains business logic and data validation\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Command files
add_command_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Console command for CLI operations\\
 * Provides command-line interface functionality\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Job files
add_job_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Queue job for background processing\\
 * Handles asynchronous tasks and background operations\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Route files
add_route_comments() {
    local file="$1"

    # Create temp file
    local temp_file="${file}.tmp"

    # Add file comment
    sed "1a\\
<?php\\
/**\\
 * API Routes File\\
 *\\
 * This file contains all API route definitions\\
 * Routes are grouped by domain and functionality\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Add comments to Cache files
add_cache_comments() {
    local file="$1"
    local class_name=$(basename "$file" .php)

    # Create temp file
    local temp_file="${file}.tmp"

    # Add class comment
    sed "1a\\
/**\\
 * Class ${class_name}\\
 *\\
 * Cache implementation for data storage and retrieval\\
 * Provides caching layer for improved performance\\
 */" "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

# Find all PHP files in the project (excluding vendor and node_modules)
find "/Users/buimanhkhuong/Desktop/project/project-laravel/src" \
    -name "*.php" \
    -type f \
    -not -path "*/vendor/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/storage/*" \
    -not -path "*/bootstrap/cache/*" \
    | while read -r file; do
        add_comments_to_file "$file"
    done

echo "Completed adding PHPDoc comments to all PHP files!"