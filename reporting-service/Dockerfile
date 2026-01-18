# Stage 1: Build
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# FIX: Force uv to copy binaries instead of symlinking them
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=0

WORKDIR /app

# Install dependencies
COPY pyproject.toml uv.lock ./
# --no-install-project avoids trying to install your local code as a package yet
RUN uv sync --frozen --no-install-project --no-dev

# Stage 2: Runtime
FROM python:3.12-slim-bookworm

WORKDIR /app

# Copy the actual virtual environment (not symlinks)
COPY --from=builder /app/.venv /app/.venv

# Update PATH to use the venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy application code
COPY . .

EXPOSE 8000

# Use the 'python -m' approach to avoid direct bin path issues
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
