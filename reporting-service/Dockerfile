# Use the official uv image which includes Python 3.12
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# Set the working directory
WORKDIR /app

# Enable bytecode compilation and ensure uv doesn't try to download a new python
ENV UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=0

# Copy only dependency files first to leverage Docker caching
COPY pyproject.toml uv.lock ./

# Install dependencies into /app/.venv
RUN uv sync --frozen --no-dev

# Copy the rest of your application code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Separate "uv" and "run" into their own strings
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



