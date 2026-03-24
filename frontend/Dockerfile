FROM node:20-slim

WORKDIR /app

# 核心修复：清理环境，避免 host 系统的文件干扰
# 强制 npm 重新评估当前系统的原生二进制包需求
COPY package*.json ./
RUN rm -f package-lock.json && \
    npm config set registry https://registry.npmmirror.com && \
    npm install --force

COPY . .

# 确保运行时不会误读旧的编译缓存
RUN rm -rf .next

EXPOSE 3000

CMD ["npm", "run", "dev"]