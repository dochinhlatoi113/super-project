# 🔧 Scripts Directory

> Tất cả scripts của project được tập trung tại đây

---

## 📁 Danh sách Scripts

### 🔄 Environment Management

#### 1. `docker-switch-env.sh`

**Mục đích:** Switch environment trong Docker container

**Usage:**

```bash
cd /Users/buimanhkhuong/Desktop/project
./scripts/docker-switch-env.sh local
./scripts/docker-switch-env.sh prod
```

**Features:**

-   Backup current `.env` → `.env.backup.local` hoặc `.env.backup.prod`
-   Copy env file mới từ `env-main/`
-   Clear Laravel caches
-   Show current environment info

**Requirements:** Docker container `laravel_php` phải đang chạy

---

#### 2. `switch-env.sh`

**Mục đích:** Switch environment ngoài Docker (local PHP)

**Usage:**

```bash
cd /Users/buimanhkhuong/Desktop/project/src
./scripts/switch-env.sh local
./scripts/switch-env.sh prod
```

**Use case:** Khi chạy Laravel trực tiếp với PHP (không dùng Docker)

---

#### 3. `env-aliases.sh`

**Mục đích:** Bash/Zsh aliases cho environment commands

**Usage:**

```bash
# Add to ~/.zshrc or ~/.bashrc
source /Users/buimanhkhuong/Desktop/project/scripts/env-aliases.sh

# Sau đó dùng:
env-local      # Switch to local
env-prod       # Switch to production
env-check      # Check current environment
env-help       # Show help
```

**Aliases available:**

-   `env-local` → `make env-local`
-   `env-prod` → `make env-prod`
-   `env-check` → `make env-check`
-   `env-backup` → `make env-backup`
-   `env-list` → `make env-list`
-   `env-help` → `make help`

---

### ⚡ Kafka Management

#### 4. `kafka-control.sh`

**Mục đích:** Quản lý Kafka topics và consumers

**Usage:**

```bash
./scripts/kafka-control.sh

# Interactive menu:
# 1. List topics
# 2. Create topic
# 3. Describe topic
# 4. Delete topic
# 5. List consumer groups
# 6. Consume messages
# 7. Produce messages
# 8. Exit
```

**Features:**

-   List/Create/Delete Kafka topics
-   Describe topic details
-   Monitor consumer groups
-   Consume/Produce messages
-   Interactive menu

**Requirements:** Kafka container phải đang chạy

---

#### 5. `kafka-setup.sh`

**Mục đích:** Initial Kafka setup script

**Usage:**

```bash
./scripts/kafka-setup.sh
```

**What it does:**

-   Create initial topics
-   Setup consumer groups
-   Configure partitions

**Use case:** Chạy 1 lần khi setup project mới

---

### 🎯 Main Script

#### 6. `main.sh`

**Mục đích:** Main entry point script

**Usage:**

```bash
./scripts/main.sh
```

**What it does:**

-   Project initialization
-   Setup checklist
-   Quick commands menu

---

## 🚀 Quick Reference

### Môi trường (Environment)

```bash
# Switch environment (Docker)
./scripts/docker-switch-env.sh local
./scripts/docker-switch-env.sh prod

# Hoặc dùng Makefile (khuyên dùng)
make env-local
make env-prod
make env-check
```

### Kafka

```bash
# Interactive Kafka menu
./scripts/kafka-control.sh

# Hoặc direct commands
docker exec laravel_kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Aliases

```bash
# Add to shell config
echo 'source ~/Desktop/project/scripts/env-aliases.sh' >> ~/.zshrc
source ~/.zshrc

# Use aliases
env-local
env-prod
env-check
```

---

## 📋 Script Dependencies

| Script                 | Requires        | Description               |
| ---------------------- | --------------- | ------------------------- |
| `docker-switch-env.sh` | Docker          | Switch env in container   |
| `switch-env.sh`        | Local PHP       | Switch env outside Docker |
| `env-aliases.sh`       | Makefile        | Bash aliases              |
| `kafka-control.sh`     | Kafka container | Manage Kafka              |
| `kafka-setup.sh`       | Kafka container | Initial setup             |
| `main.sh`              | -               | Main entry point          |

---

## 🔧 Make Scripts Executable

Nếu script báo "Permission denied":

```bash
cd /Users/buimanhkhuong/Desktop/project/scripts
chmod +x *.sh
```

---

## 📖 Related Documentation

-   **Environment Switcher:** [../ghi-chu/details/ENVIRONMENT_SWITCHER.md](../ghi-chu/details/ENVIRONMENT_SWITCHER.md)
-   **Kafka Guide:** [../ghi-chu/details/kafka.md](../ghi-chu/details/kafka.md)
-   **Main README:** [../ghi-chu/README.md](../ghi-chu/README.md)

---

## 🎯 Best Practices

1. **Luôn dùng Makefile khi có thể:**

    ```bash
    make env-local    # Thay vì ./scripts/docker-switch-env.sh local
    ```

2. **Check script location:**

    ```bash
    # Nếu ở root project
    ./scripts/docker-switch-env.sh local

    # Nếu ở trong src/
    ../scripts/docker-switch-env.sh local
    ```

3. **Backup trước khi chạy script quan trọng:**

    ```bash
    make env-backup
    ./scripts/docker-switch-env.sh prod
    ```

4. **Check container status trước khi chạy:**
    ```bash
    docker ps    # Verify containers are running
    ./scripts/kafka-control.sh
    ```

---

## ⚠️ Important Notes

-   ⚠️ Scripts này có thể modify `.env` và database
-   ⚠️ Luôn backup trước khi switch environment
-   ⚠️ Production scripts cần extra caution
-   ✅ Test scripts trên local trước khi dùng production

---

**Last Updated:** October 18, 2025
