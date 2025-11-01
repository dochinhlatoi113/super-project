#!/bin/bash

# Script để quản lý Kafka consumers BÊN TRONG container
# Usage: ./kafka-control-internal.sh [start|stop|restart|status|logs]

# Function to check if supervisor is available
check_supervisor_available() {
    # Check if supervisor is running AND socket exists
    if cat /proc/*/cmdline 2>/dev/null | grep -q supervisord && [ -S /var/run/supervisor.sock ]; then
        return 0  # Available
    else
        return 1  # Not available
    fi
}

# Ensure we're in the Laravel project root
cd /var/www/html

ACTION=${1:-status}

case $ACTION in
    start)
        echo "🚀 Starting Kafka consumers via supervisor..."
        
        # Check if supervisor is available
        if check_supervisor_available; then
            echo "✅ Supervisor is running, starting consumers..."
            
            # Start kafka consumers via supervisor
            supervisorctl start kafka-product-audit 2>/dev/null && echo "  ✅ Audit consumer started" || echo "  ❌ Failed to start audit consumer"
            supervisorctl start kafka-product-cache 2>/dev/null && echo "  ✅ Cache consumer started" || echo "  ❌ Failed to start cache consumer"
            supervisorctl start kafka-product-elasticsearch 2>/dev/null && echo "  ✅ Elasticsearch consumer started" || echo "  ❌ Failed to start elasticsearch consumer"
            
            echo "✅ Consumers started via supervisor!"
        else
            echo "❌ Supervisor not running, falling back to script-managed mode..."
            
            # Fallback to script-managed mode
            nohup php artisan product:kafka-audit > /tmp/kafka-audit.log 2>&1 &
            echo $! > /tmp/kafka-audit.pid
            
            nohup php artisan product:kafka-cache > /tmp/kafka-cache.log 2>&1 &
            echo $! > /tmp/kafka-cache.pid
            
            nohup php artisan product:kafka-elasticsearch > /tmp/kafka-elasticsearch.log 2>&1 &
            echo $! > /tmp/kafka-elasticsearch.pid
            
            sleep 2
            echo "✅ Consumers started in script-managed mode!"
        fi
        ;;
    
    stop)
        echo "🛑 Stopping Kafka consumers..."
        
        # Check if supervisor is available
        if check_supervisor_available; then
            echo "✅ Supervisor is running, stopping consumers via supervisor..."
            
            # Stop kafka consumers via supervisor
            supervisorctl stop kafka-product-audit 2>/dev/null && echo "  ✅ Audit consumer stopped" || echo "  ❌ Failed to stop audit consumer"
            supervisorctl stop kafka-product-cache 2>/dev/null && echo "  ✅ Cache consumer stopped" || echo "  ❌ Failed to stop cache consumer"
            supervisorctl stop kafka-product-elasticsearch 2>/dev/null && echo "  ✅ Elasticsearch consumer stopped" || echo "  ❌ Failed to stop elasticsearch consumer"
            
            echo "✅ Consumers stopped via supervisor!"
        else
            echo "❌ Supervisor not running, stopping script-managed consumers..."
            
            # Stop script-managed consumers
            if [ -f /tmp/kafka-audit.pid ]; then
                kill $(cat /tmp/kafka-audit.pid) 2>/dev/null && echo "  ✅ Audit consumer stopped"
                rm /tmp/kafka-audit.pid
            fi
            
            if [ -f /tmp/kafka-cache.pid ]; then
                kill $(cat /tmp/kafka-cache.pid) 2>/dev/null && echo "  ✅ Cache consumer stopped"
                rm /tmp/kafka-cache.pid
            fi
            
            if [ -f /tmp/kafka-elasticsearch.pid ]; then
                kill $(cat /tmp/kafka-elasticsearch.pid) 2>/dev/null && echo "  ✅ Elasticsearch consumer stopped"
                rm /tmp/kafka-elasticsearch.pid
            fi
            
            # Force kill any remaining processes using /proc filesystem
            for pid_dir in /proc/*; do
                if [ -d "$pid_dir" ] && [ -f "$pid_dir/cmdline" ]; then
                    if grep -q "product:kafka-audit\|product:kafka-cache\|product:kafka-elasticsearch" "$pid_dir/cmdline" 2>/dev/null; then
                        PID=$(basename "$pid_dir")
                        kill -9 $PID 2>/dev/null && echo "  ✅ Force killed consumer (PID: $PID)"
                    fi
                fi
            done
            
            echo "✅ Script-managed consumers stopped!"
        fi
        ;;
    
    restart)
        echo "🔄 Restarting Kafka consumers..."
        
        # Check if supervisor is available
        if check_supervisor_available; then
            echo "✅ Supervisor is running, restarting consumers via supervisor..."
            
            # Restart kafka consumers via supervisor
            supervisorctl restart kafka-product-audit 2>/dev/null && echo "  ✅ Audit consumer restarted" || echo "  ❌ Failed to restart audit consumer"
            supervisorctl restart kafka-product-cache 2>/dev/null && echo "  ✅ Cache consumer restarted" || echo "  ❌ Failed to restart cache consumer"
            supervisorctl restart kafka-product-elasticsearch 2>/dev/null && echo "  ✅ Elasticsearch consumer restarted" || echo "  ❌ Failed to restart elasticsearch consumer"
            
            echo "✅ Consumers restarted via supervisor!"
        else
            echo "❌ Supervisor not running, restarting script-managed consumers..."
            $0 stop
            sleep 2
            $0 start
        fi
        ;;
    
    status)
        echo "📊 Kafka System Status:"
        echo ""

        # Check Supervisor status
        echo "👔 Supervisor Status:"
        if check_supervisor_available; then
            echo "  ✅ Supervisor: RUNNING"
            SUPERVISOR_RUNNING=true
        else
            echo "  ❌ Supervisor: NOT RUNNING"
            SUPERVISOR_RUNNING=false
        fi
        echo ""

        # Check Kafka broker
        echo "🔍 Kafka Broker Status:"
        if timeout 5 bash -c "</dev/tcp/kafka/9092" 2>/dev/null; then
            echo "  ✅ Kafka broker: CONNECTED (kafka:9092)"
        else
            echo "  ❌ Kafka broker: NOT CONNECTED (kafka:9092)"
        fi
        echo ""

        # Check consumers
        echo "👥 Consumers Status:"
        if [ "$SUPERVISOR_RUNNING" = true ]; then
            echo "  📋 Via Supervisor:"
            supervisorctl status kafka-product-audit 2>/dev/null | sed 's/^/    /' || echo "    kafka-product-audit: NOT FOUND"
            supervisorctl status kafka-product-cache 2>/dev/null | sed 's/^/    /' || echo "    kafka-product-cache: NOT FOUND"
            supervisorctl status kafka-product-elasticsearch 2>/dev/null | sed 's/^/    /' || echo "    kafka-product-elasticsearch: NOT FOUND"
        else
            echo "  📋 Via Process Check:"
            # Check audit consumer - use PID file first, then try to find process
            if [ -f /tmp/kafka-audit.pid ] && kill -0 $(cat /tmp/kafka-audit.pid) 2>/dev/null; then
                PID=$(cat /tmp/kafka-audit.pid)
                echo "    ✅ Audit consumer: RUNNING (PID: $PID, script-managed)"
            else
                echo "    ❌ Audit consumer: NOT RUNNING"
            fi

            # Check cache consumer
            if [ -f /tmp/kafka-cache.pid ] && kill -0 $(cat /tmp/kafka-cache.pid) 2>/dev/null; then
                PID=$(cat /tmp/kafka-cache.pid)
                echo "    ✅ Cache consumer: RUNNING (PID: $PID, script-managed)"
            else
                echo "    ❌ Cache consumer: NOT RUNNING"
            fi

            # Check elasticsearch consumer
            if [ -f /tmp/kafka-elasticsearch.pid ] && kill -0 $(cat /tmp/kafka-elasticsearch.pid) 2>/dev/null; then
                PID=$(cat /tmp/kafka-elasticsearch.pid)
                echo "    ✅ Elasticsearch consumer: RUNNING (PID: $PID, script-managed)"
            else
                echo "    ❌ Elasticsearch consumer: NOT RUNNING"
            fi
        fi

        echo ""
        echo "💡 Management: $([ "$SUPERVISOR_RUNNING" = true ] && echo 'Supervisor' || echo 'Script-managed')"
        ;;
    
    logs)
        CONSUMER=${2:-all}
        LINES=${3:-20}
        
        echo "📄 Recent logs (last $LINES lines):"
        echo ""
        
        if [ "${CONSUMER}" = "audit" ] || [ "${CONSUMER}" = "all" ]; then
            echo "=== AUDIT CONSUMER ==="
            tail -n $LINES /tmp/kafka-audit.log 2>/dev/null || echo "No logs found"
            echo ""
        fi
        
        if [ "${CONSUMER}" = "cache" ] || [ "${CONSUMER}" = "all" ]; then
            echo "=== CACHE CONSUMER ==="
            tail -n $LINES /tmp/kafka-cache.log 2>/dev/null || echo "No logs found"
            echo ""
        fi
        
        if [ "${CONSUMER}" = "elasticsearch" ] || [ "${CONSUMER}" = "all" ]; then
            echo "=== ELASTICSEARCH CONSUMER ==="
            tail -n $LINES /tmp/kafka-elasticsearch.log 2>/dev/null || echo "No logs found"
        fi
        ;;
    
    test)
        echo "🧪 Testing consumers connection..."
        echo ""
        
        echo "1. Kafka connection:"
        php artisan product:kafka-audit --test 2>&1 | head -5
        
        echo ""
        echo "2. Elasticsearch connection:"
        curl -s http://localhost/api/v1/products/search/health 2>/dev/null | head -10
        ;;
    
    supervisor)
        echo "👔 Supervisor consumers status:"
        echo ""
        
        # Check if supervisor is available (using function)
        if check_supervisor_available; then
            echo "✅ Supervisor: RUNNING"
            echo ""
            
            # Try to get supervisor status for kafka consumers
            echo "Supervisor programs status:"
            supervisorctl status 2>/dev/null | grep kafka || echo "No kafka programs found in supervisor"
        else
            echo "❌ Supervisor: NOT RUNNING"
            echo ""
            echo "💡 Consumers may be running via other methods"
        fi
        ;;
    
    health)
        echo "🏥 System Health Check:"
        echo ""
        
        # Supervisor status
        echo "0. Supervisor:"
        if check_supervisor_available; then
            echo "   ✅ Supervisor running"
            SUPERVISOR_STATUS="✅ Supervisor running"
        else
            echo "   ❌ Supervisor not running"
            SUPERVISOR_STATUS="❌ Supervisor not running"
        fi
        
        # Kafka broker
        echo "1. Kafka Broker:"
        if timeout 5 bash -c "</dev/tcp/kafka/9092" 2>/dev/null; then
            echo "   ✅ Connected to kafka:9092"
        else
            echo "   ❌ Cannot connect to kafka:9092"
        fi
        
        # Elasticsearch
        echo "2. Elasticsearch:"
        if curl -s --max-time 5 http://elasticsearch:9200/_cluster/health | grep -q '"status":"green"\|"status":"yellow"'; then
            echo "   ✅ Elasticsearch healthy"
        else
            echo "   ❌ Elasticsearch not healthy"
        fi
        
        # MySQL
        echo "3. MySQL:"
        if nc -z mysql 3306 2>/dev/null; then
            echo "   ✅ MySQL connected"
        else
            echo "   ❌ MySQL not connected"
        fi
        
        # Redis
        echo "4. Redis:"
        if nc -z redis 6379 2>/dev/null; then
            echo "   ✅ Redis connected"
        else
            echo "   ❌ Redis not connected"
        fi
        
        echo ""
        echo "5. Active Consumers:"
        AUDIT_COUNT=0 && CACHE_COUNT=0 && ES_COUNT=0
        if check_supervisor_available; then
            # Count via supervisor
            supervisorctl status kafka-product-audit >/dev/null 2>&1 && AUDIT_COUNT=1
            supervisorctl status kafka-product-cache >/dev/null 2>&1 && CACHE_COUNT=1
            supervisorctl status kafka-product-elasticsearch >/dev/null 2>&1 && ES_COUNT=1
        else
            # Count via PID files
            [ -f /tmp/kafka-audit.pid ] && kill -0 $(cat /tmp/kafka-audit.pid) 2>/dev/null && AUDIT_COUNT=1
            [ -f /tmp/kafka-cache.pid ] && kill -0 $(cat /tmp/kafka-cache.pid) 2>/dev/null && CACHE_COUNT=1
            [ -f /tmp/kafka-elasticsearch.pid ] && kill -0 $(cat /tmp/kafka-elasticsearch.pid) 2>/dev/null && ES_COUNT=1
        fi
        TOTAL_COUNT=$((AUDIT_COUNT + CACHE_COUNT + ES_COUNT))
        echo "   📊 $TOTAL_COUNT consumer processes running (Audit: $AUDIT_COUNT, Cache: $CACHE_COUNT, ES: $ES_COUNT)"
        echo ""
        echo "📋 Summary: $SUPERVISOR_STATUS | Consumers: $TOTAL_COUNT/3"
        ;;
    
    list)
        echo "📋 All running Kafka consumer processes:"
        for pid_dir in /proc/*; do
            if [ -d "$pid_dir" ] && [ -f "$pid_dir/cmdline" ]; then
                PID=$(basename "$pid_dir")
                if grep -q "product:kafka" "$pid_dir/cmdline" 2>/dev/null; then
                    CMDLINE=$(tr '\0' ' ' < "$pid_dir/cmdline")
                    echo "PID: $PID - $CMDLINE"
                fi
            fi
        done | head -10 || echo "No processes found"
        ;;
    
    *)
        echo "Usage: $0 {start|stop|restart|status|supervisor|health|logs|test|list}"
        echo ""
        echo "Commands:"
        echo "  start      - Start all 3 consumers in background (script-managed)"
        echo "  stop       - Stop all consumers"
        echo "  restart    - Restart all consumers"
        echo "  status     - Check consumers and Kafka broker status"
        echo "  supervisor - Check supervisor-managed consumers"
        echo "  health     - System health check (Kafka, ES, MySQL, Redis)"
        echo "  logs       - Show recent logs [consumer] [lines]"
        echo "               Example: $0 logs audit 50"
        echo "  test       - Test Kafka and Elasticsearch connections"
        echo "  list       - List all running consumer processes"
        exit 1
        ;;
esac
