# Node.js 이미지를 기반으로
FROM node:20

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 필요한 파일 복사
COPY package*.json ./
RUN npm install

# PM2 글로벌 설치
RUN npm install -g pm2

# 소스 코드 복사
COPY ./ ./

# 서버가 실행될 포트 설정
EXPOSE 3000

# PM2를 사용하여 앱 실행
CMD ["pm2-runtime", "start", "main.js"]
