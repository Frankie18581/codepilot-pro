FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# 使用清华源并忽略代理，直接连接国内镜像
RUN pip install --no-cache-dir -r requirements.txt \
    -i https://pypi.tuna.tsinghua.edu.cn/simple \
    --trusted-host pypi.tuna.tsinghua.edu.cn

COPY . .
# 是否需要dockerignore?

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]