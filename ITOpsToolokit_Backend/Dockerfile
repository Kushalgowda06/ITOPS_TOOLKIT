FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Install core langchain packages first
RUN pip install --no-cache-dir \
    langchain==0.1.20 \
    langchain-core==0.1.53 \
    langchain-community==0.0.38 \
    langchain-text-splitters==0.0.2 \
    langchain-huggingface==0.0.3 \
    langchain-google-vertexai==0.0.6 \
    langchain-openai==0.0.2

# Install remaining packages ignoring dependency conflicts
RUN pip install --no-cache-dir --no-deps -r requirements.txt || true

# Install critical missing packages
RUN pip install --no-cache-dir \
    icecream \
    python-decouple \
    psycopg2-binary \
    python-multipart \
    fastapi==0.115.6 \
    uvicorn==0.34.0 \
    hvac==2.3.0 \
    requests==2.32.3 \
    pydantic==2.9.0 \
    email-validator

RUN mkdir -p /app/config && echo "placeholder" > /app/config/.vault_token

COPY . .

CMD ["uvicorn", "fastapi_main:app", "--host", "0.0.0.0", "--port", "8000"]
