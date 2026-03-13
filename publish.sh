#!/bin/bash
# NPM 发布脚本

set -e  # 遇到错误立即退出

echo "🎯 OpenClaw Intent Router - NPM 发布脚本"
echo "=========================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否已登录 npm
echo "📝 检查 npm 登录状态..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 未登录 npm，请先运行: npm login"
    exit 1
fi

echo "✅ 已登录 npm: $(npm whoami)"
echo ""

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf dist/
echo "✅ 清理完成"
echo ""

# 运行测试
echo "🧪 运行测试..."
npm test
echo "✅ 测试通过"
echo ""

# 构建项目
echo "🏗️  构建项目..."
npm run build
echo "✅ 构建完成"
echo ""

# 检查构建产物
echo "📦 检查构建产物..."
if [ ! -d "dist" ]; then
    echo "❌ 错误: dist 目录不存在"
    exit 1
fi

echo "构建文件:"
ls -lh dist/
echo ""

# 获取当前版本号
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "📋 发布信息:"
echo "  包名: $PACKAGE_NAME"
echo "  版本: $VERSION"
echo ""

# 干跑测试
echo "🔍 执行干跑测试..."
npm publish --dry-run
echo ""

# 确认发布
read -p "❓ 确认发布 $PACKAGE_NAME@$VERSION 到 npm? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
fi

# 发布到 npm
echo ""
echo "🚀 正在发布到 npm..."
npm publish

echo ""
echo "✅ 发布成功!"
echo ""

# 创建 Git 标签
echo "🏷️  创建 Git 标签 v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION" 2>/dev/null || echo "⚠️  标签已存在或无法创建"

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
read -p "❓ 是否推送到 GitHub? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    git push origin "v$VERSION" 2>/dev/null || echo "⚠️  标签推送失败"
    echo "✅ 已推送到 GitHub"
fi

echo ""
echo "🎉 发布完成!"
echo ""
echo "📊 查看包页面:"
echo "   https://www.npmjs.com/package/$PACKAGE_NAME"
echo ""
echo "📥 安装命令:"
echo "   npm install $PACKAGE_NAME"
echo ""
echo "🧪 测试安装:"
echo "   npm install -g $PACKAGE_NAME"
echo "   intent-router --help"
echo ""
