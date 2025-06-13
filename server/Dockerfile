    # Use Python 3.12 slim image
FROM python:3.12.0-slim-bookworm

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONWRITEBYTECODE=1 \
    APP=/app

# Set working directory
WORKDIR $APP

# Install dependencies
COPY requirements.txt $APP/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . $APP/

# Expose port for Gunicorn
EXPOSE 8000

# Make entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]

# Gunicorn command (can be overridden in entrypoint if needed)
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi:application"]
