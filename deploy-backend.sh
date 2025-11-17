#!/bin/bash

# Railway 后端一键部署脚本

echo "🚀 开始部署后端到 Railway..."

# 检查 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装，正在安装..."
    npm install -g @railway/cli
fi

# 进入后端目录
cd backend

# 登录 Railway（如果需要）
echo "📝 检查 Railway 登录状态..."
if ! railway whoami &> /dev/null; then
    echo "🔐 需要登录 Railway，请在浏览器中完成登录..."
    railway login
fi

# 创建或链接项目
echo "🔗 链接到 Railway 项目..."
if [ ! -f ".railway/project.json" ]; then
    echo "创建新项目..."
    railway init
else
    echo "使用现有项目..."
    railway link
fi

# 设置环境变量
echo "⚙️ 配置环境变量..."
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app

# 部署
echo "🚀 开始部署..."
railway up

# 等待部署完成
echo "⏳ 等待部署完成..."
sleep 10

# 获取部署 URL
echo "📋 获取部署信息..."
railway domain

# 初始化数据库
echo "🗄️ 初始化数据库..."
railway run npm run db:init

echo "✅ 部署完成！"
echo "📝 请复制上面的域名，然后更新 Vercel 中的 REACT_APP_API_URL 环境变量"

