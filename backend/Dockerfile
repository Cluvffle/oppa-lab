# 챠밍 백엔드 Dockerfile (Fly.io 배포용)
# 빌드 컨텍스트 = backend/  (fly launch/deploy 를 backend/ 안에서 실행)
FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성 (bcrypt/pillow 등 빌드용)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 (레이어 캐시)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 앱 코드
COPY . /app/

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 프록시(Fly edge)가 WebSocket 도 그대로 프록시 하므로 별도 옵션 불필요.
# Reload 는 dev 전용, prod 는 미사용.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
