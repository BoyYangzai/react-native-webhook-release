# 使用官方 Node.js 镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制 package.json, pnpm-lock.yaml 到工作目录
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装应用程序的依赖项
RUN pnpm install

# 复制应用程序代码到工作目录
COPY . .

# 暴露应用程序运行的端口
EXPOSE 9995

# 定义容器启动时运行的命令
CMD ["pnpm", "start"]
