# NPM 发布准备清单

## 📋 发布前检查清单

### ✅ 已完成的配置

- [x] **包名确认**: `openclaw-intent-router`
- [x] **版本号**: `1.0.0`
- [x] **许可证**: MIT
- [x] **仓库地址**: https://github.com/ZhenRobotics/openclaw-intent-router
- [x] **关键词优化**: 已添加 13 个相关关键词
- [x] **文档完整**: README.md, QUICKSTART.md, LICENSE
- [x] **类型定义**: TypeScript 声明文件自动生成

---

## 🔍 发布前必须检查

### 1. 代码质量 ✅
```bash
# 运行测试
npm test

# 构建项目
npm run build

# 检查构建产物
ls -la dist/
```

### 2. package.json 配置 ✅
- [x] `name`: openclaw-intent-router
- [x] `version`: 1.0.0
- [x] `description`: 清晰的项目描述
- [x] `main`: dist/index.js
- [x] `types`: dist/index.d.ts
- [x] `bin`: CLI 入口点配置
- [x] `files`: 指定发布文件
- [x] `keywords`: SEO 优化关键词
- [x] `repository`: GitHub 仓库地址
- [x] `license`: MIT
- [x] `engines`: Node.js >= 18.0.0

### 3. 文档检查 ✅
- [x] README.md - 完整的项目介绍
- [x] QUICKSTART.md - 快速开始指南
- [x] LICENSE - MIT 许可证
- [x] 代码注释 - 所有公共 API 已注释
- [x] 示例代码 - examples/ 目录

### 4. 版本控制
- [ ] Git 提交已完成
- [ ] 创建版本标签: `git tag v1.0.0`
- [ ] 推送到 GitHub: `git push && git push --tags`

---

## 🚀 发布步骤

### 步骤 1: 最终测试
```bash
# 运行完整测试套件
npm test

# 输出应显示:
# ✅ All tests passed!
```

### 步骤 2: 构建生产版本
```bash
# 清理旧的构建文件
rm -rf dist/

# 构建
npm run build

# 验证构建产物
ls -la dist/
# 应该看到: index.js, index.d.ts, cli/, core/, skills/, matchers/, utils/
```

### 步骤 3: 测试本地包
```bash
# 在项目目录
npm pack

# 会生成: openclaw-intent-router-1.0.0.tgz
# 可以在另一个项目中测试安装:
# npm install /path/to/openclaw-intent-router-1.0.0.tgz
```

### 步骤 4: 登录 npm
```bash
# 如果还未登录
npm login

# 输入你的 npm 账号信息
# Username: _______
# Password: _______
# Email: _______
```

### 步骤 5: 发布到 npm
```bash
# 干跑测试（不会真正发布）
npm publish --dry-run

# 检查输出，确认要发布的文件列表正确

# 正式发布
npm publish

# 成功后会看到:
# + openclaw-intent-router@1.0.0
```

### 步骤 6: 验证发布
```bash
# 在 npm 上查看
npm view openclaw-intent-router

# 在另一个项目测试安装
npm install openclaw-intent-router
```

### 步骤 7: 创建 GitHub Release
```bash
# 推送代码和标签
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0

# 然后在 GitHub 上创建 Release
# https://github.com/ZhenRobotics/openclaw-intent-router/releases/new
```

---

## 📊 发布后检查

### 1. npm 包页面
- [ ] 访问: https://www.npmjs.com/package/openclaw-intent-router
- [ ] 检查 README 渲染正确
- [ ] 检查版本号、下载徽章
- [ ] 检查关键词和搜索

### 2. 安装测试
```bash
# 创建测试项目
mkdir test-install
cd test-install
npm init -y

# 安装包
npm install openclaw-intent-router

# 测试导入
node -e "const { IntentRouter } = require('openclaw-intent-router'); console.log('✅ Import works!');"
```

### 3. CLI 测试
```bash
# 全局安装
npm install -g openclaw-intent-router

# 测试命令
intent-router --version
intent-router skills
intent-router route "test query"
```

---

## 🎯 发布到 ClawHub

如果你还需要发布到 ClawHub 平台：

```bash
# 根据 ClawHub 的具体要求调整
# 通常类似于:
clawhub login
clawhub publish
```

---

## 📝 版本更新流程

将来发布新版本时：

```bash
# 1. 更新代码
# 2. 运行测试
npm test

# 3. 更新版本号
npm version patch   # 1.0.0 -> 1.0.1 (bug 修复)
# 或
npm version minor   # 1.0.0 -> 1.1.0 (新功能)
# 或
npm version major   # 1.0.0 -> 2.0.0 (破坏性更改)

# 4. 发布
npm publish

# 5. 推送到 GitHub
git push && git push --tags
```

---

## ⚠️ 注意事项

### 发布不可逆
- npm 发布后 24 小时内可以撤销
- 24 小时后无法删除，只能弃用（deprecate）
- 已发布的版本号不能重复使用

### 版本语义化
遵循 [SemVer](https://semver.org/)：
- `MAJOR.MINOR.PATCH`
- MAJOR: 不兼容的 API 更改
- MINOR: 向后兼容的新功能
- PATCH: 向后兼容的 bug 修复

### 文件大小
- npm 包限制: 单个文件 < 10MB
- 总包大小建议 < 5MB
- 使用 `.npmignore` 排除不必要的文件

---

## 🎉 发布完成后

发布成功后，你可以：

1. **更新 README 徽章**
```markdown
[![npm version](https://badge.fury.io/js/openclaw-intent-router.svg)](https://www.npmjs.com/package/openclaw-intent-router)
[![npm downloads](https://img.shields.io/npm/dm/openclaw-intent-router.svg)](https://www.npmjs.com/package/openclaw-intent-router)
```

2. **社交媒体分享**
- Twitter/X 发布公告
- 相关社区分享
- 技术博客文章

3. **收集反馈**
- 鼓励用户提交 Issues
- 收集功能请求
- 持续改进

---

## 快速发布命令（全流程）

```bash
#!/bin/bash
# 一键发布脚本

echo "🧪 Running tests..."
npm test || exit 1

echo "🏗️  Building..."
npm run build || exit 1

echo "📦 Publishing to npm..."
npm publish || exit 1

echo "🏷️  Creating git tag..."
git tag "v$(node -p "require('./package.json').version")"

echo "⬆️  Pushing to GitHub..."
git push && git push --tags

echo "✅ Published successfully!"
echo "Visit: https://www.npmjs.com/package/openclaw-intent-router"
```

保存为 `publish.sh`，然后运行：
```bash
chmod +x publish.sh
./publish.sh
```

---

**准备好发布了吗？按照上面的步骤执行即可！** 🚀
