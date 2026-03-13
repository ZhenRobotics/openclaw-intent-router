#!/bin/bash

# CLI 测试脚本

echo "🧪 测试 OpenClaw Video Publisher CLI"
echo ""

# 测试 1: 查看帮助
echo "测试 1: 查看帮助"
npx tsx src/cli/index.ts --help
echo ""

# 测试 2: 查看版本
echo "测试 2: 查看版本"
npx tsx src/cli/index.ts --version
echo ""

# 测试 3: 查看可用平台（需要配置）
echo "测试 3: 查看可用平台"
if [ -f config/platforms.json ]; then
  npx tsx src/cli/index.ts platforms
else
  echo "⚠️  配置文件不存在，跳过"
fi
echo ""

echo "✅ 基础测试完成"
