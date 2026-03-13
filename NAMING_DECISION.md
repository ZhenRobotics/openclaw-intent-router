# 项目命名决策

## 待确认的命名方案

### 方案 A：使用 npm 组织作用域（推荐）⭐

```yaml
项目名称: Intent Router
npm 包名: @openclaw/intent-router
GitHub 仓库: openclaw-intent-router
ClawHub 名称: openclaw-intent-router
安装命令: npm install @openclaw/intent-router
导入语句: import { IntentRouter } from '@openclaw/intent-router'
```

**优点**：
- ✅ 避免命名冲突
- ✅ 品牌统一（@openclaw 组织）
- ✅ 专业规范
- ✅ 支持多个包（@openclaw/router, @openclaw/matcher 等）

**要求**：
- 需要在 npm 注册 @openclaw 组织
- 组织可以免费创建

---

### 方案 B：无作用域命名（备选）

```yaml
项目名称: OpenClaw Intent Router
npm 包名: openclaw-intent-router
GitHub 仓库: openclaw-intent-router
ClawHub 名称: openclaw-intent-router
安装命令: npm install openclaw-intent-router
导入语句: import { IntentRouter } from 'openclaw-intent-router'
```

**优点**：
- ✅ 简单直接
- ✅ 各平台统一
- ✅ 无需组织管理

**风险**：
- ⚠️ 包名可能被占用
- ⚠️ 后续扩展受限

---

### 方案 C：简短命名（可选）

```yaml
npm 包名: @openclaw/router
npm 包名: claw-router
npm 包名: agent-intent-router
```

---

## 检查清单

### 发布前需确认：

- [ ] **npm 包名可用性** - 检查是否已被占用
- [ ] **GitHub 仓库名** - 确认 URL 正确
- [ ] **组织账号** - npm 组织已创建（如使用作用域）
- [ ] **版本号** - 确定首发版本（建议 1.0.0）
- [ ] **License** - 已设置 MIT 许可证
- [ ] **README** - 包含安装和使用说明
- [ ] **keywords** - 优化 npm 搜索关键词

### npm 发布准备：

```json
{
  "name": "@openclaw/intent-router",  // 待确认
  "version": "1.0.0",
  "description": "Intent Router - The Search Layer for Agent Capabilities",
  "keywords": [
    "intent-router",
    "agent",
    "ai-agent",
    "skill-router",
    "capability-matching",
    "nlp"
  ],
  "publishConfig": {
    "access": "public"  // 如使用作用域，需设置为 public
  }
}
```

---

## 建议的 npm 关键词

优化搜索排名：

```
主要关键词：
- intent-router
- agent-router
- ai-agent
- skill-matching

次要关键词：
- capability-router
- intent-recognition
- agent-framework
- nlp-router
- skill-dispatcher
```

---

## ClawHub 特定配置

如果 ClawHub 需要特殊命名规范，请提供：

```yaml
ClawHub 包名格式: ?
ClawHub 组织名: ?
ClawHub 访问权限: public/private
```

---

## 下一步行动

### 1. 确认命名方案
请选择方案 A、B 或 C，或提供自定义方案。

### 2. 注册 npm 组织（如选择方案 A）
```bash
npm login
npm org create openclaw
```

### 3. 更新项目配置
我将根据你的选择更新：
- package.json
- README.md
- 所有文档中的安装命令
- GitHub 仓库链接

### 4. 发布准备
- 运行测试
- 构建项目
- 发布到 npm

---

## 你的决定

**请告诉我：**

1. **你选择哪个方案？** (A / B / C / 自定义)

2. **npm 组织名是否为 @openclaw？**
   - 是，已注册
   - 是，需要注册
   - 否，使用其他名称：_______

3. **首发版本号？**
   - 1.0.0（稳定版）
   - 0.1.0（测试版）

4. **GitHub 组织账号？**
   - ZhenRobotics（当前）
   - openclaw（新建）
   - 其他：_______

---

确认后，我将立即更新所有相关文件并准备发布。
