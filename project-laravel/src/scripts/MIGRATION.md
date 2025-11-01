# 📦 Scripts Migration Notice

> **All scripts have been moved to `scripts/` directory**

---

## ⚠️ Important Change

**Date:** October 18, 2025

All shell scripts have been consolidated into a single `scripts/` directory for better organization.

---

## 📁 Old Location → New Location

| Old Path                   | New Path                       |
| -------------------------- | ------------------------------ |
| `.script-main.sh`          | `scripts/main.sh`              |
| `src/.script-kafka.sh`     | `scripts/kafka-setup.sh`       |
| `src/docker-switch-env.sh` | `scripts/docker-switch-env.sh` |
| `src/env-aliases.sh`       | `scripts/env-aliases.sh`       |
| `src/kafka-control.sh`     | `scripts/kafka-control.sh`     |
| `src/switch-env.sh`        | `scripts/switch-env.sh`        |

---

## ✅ What Still Works

### Makefile Commands (NO CHANGE NEEDED)

```bash
make env-local     # Still works!
make env-prod      # Still works!
make env-check     # Still works!
```

**Makefile has been updated** to point to new `scripts/` location automatically.

---

## 🔄 What You Need to Update

### 1. Direct Script Calls

**Old:**

```bash
./docker-switch-env.sh local
./src/switch-env.sh local
```

**New:**

```bash
./scripts/docker-switch-env.sh local
./scripts/switch-env.sh local
```

### 2. Bash Aliases Source

**Old:**

```bash
source /Users/buimanhkhuong/Desktop/project/env-aliases.sh
```

**New:**

```bash
source /Users/buimanhkhuong/Desktop/project/scripts/env-aliases.sh
```

Update in your `~/.zshrc` or `~/.bashrc`:

```bash
# Edit config file
nano ~/.zshrc

# Find and replace old path with:
source ~/Desktop/project/scripts/env-aliases.sh

# Reload
source ~/.zshrc
```

### 3. Documentation References

Some documentation files may still reference old paths. Use the new paths:

-   `scripts/docker-switch-env.sh`
-   `scripts/switch-env.sh`
-   `scripts/env-aliases.sh`
-   `scripts/kafka-control.sh`

---

## 📖 Documentation

**Full script documentation:** [scripts/README.md](../scripts/README.md)

---

## 🎯 Benefits of This Change

✅ **Better Organization** - All scripts in one place  
✅ **Easier to Find** - No more hunting for scripts  
✅ **Cleaner Root** - Project root less cluttered  
✅ **Consistent Structure** - Like `ghi-chu/` folder  
✅ **Better Documentation** - README in scripts/

---

## 🚀 Quick Migration Checklist

-   [x] Scripts moved to `scripts/` directory
-   [x] Makefile updated to new paths
-   [x] Scripts README created
-   [ ] Update shell config aliases (if using)
-   [ ] Update CI/CD scripts (if any)
-   [ ] Update deployment scripts (if any)

---

**If you encounter any issues, use Makefile commands (they still work!):**

```bash
make env-local
make env-prod
make env-check
```
