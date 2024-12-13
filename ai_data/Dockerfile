FROM python:3.10

WORKDIR /usr/src/app

# 의존성 파일 복사
COPY . .

# 필요한 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI 실행 (nohup이나 & 없이, Docker는 주 프로세스를 사용)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
