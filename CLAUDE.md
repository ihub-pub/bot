# IHub Bot

基于 Probot 框架的 GitHub App，用于自动化管理 GitHub 仓库工作流。

## 项目结构

```
├── app.js              # 主入口文件，注册所有功能模块
├── lib/                # 功能模块目录
│   ├── auto-merge.js   # 自动审核与合并
│   ├── auto-milestone.js # 里程碑自动管理
│   ├── check-milestone.js # 里程碑状态检查
│   ├── cleanup-action-caches.js # 清理 GitHub Actions 缓存
│   ├── log.js          # 日志工具
│   ├── welcome.js      # Issue 欢迎消息
│   └── workflow_run-retry.js # 工作流重试
├── action.yml          # GitHub Action 配置 (Gradle 命令)
├── publish/action.yml  # 发布 Action 配置
├── app.yml             # GitHub App 配置
├── Dockerfile          # Docker 部署配置
└── package.json        # 项目依赖配置
```

## 功能模块

### 1. Welcome ([lib/welcome.js](lib/welcome.js))
- **触发事件**: `issues.opened`
- **功能**: 新 Issue 打开时自动发送欢迎评论

### 2. Check Milestone ([lib/check-milestone.js](lib/check-milestone.js))
- **触发事件**: `pull_request`, `issues`
- **功能**: 检查 PR 是否设置了里程碑，创建提交状态检查
- **状态**: 未设置里程碑时状态为 `pending`

### 3. Auto Milestone ([lib/auto-milestone.js](lib/auto-milestone.js))
- **触发事件**: `release.published`, `milestone.closed`, `pull_request`
- **功能**:
  - Release 发布时自动关闭同名里程碑
  - 里程碑关闭时自动创建下一个版本里程碑
  - PR 打开时自动设置里程碑（仅一个开放里程碑时）
  - PR 未合并关闭时自动清除里程碑

### 4. Auto Merge ([lib/auto-merge.js](lib/auto-merge.js))
- **触发事件**: `pull_request.opened`, `workflow_run.completed`
- **功能**:
  - Bot 创建的 PR 自动审批（无其他审核者时）
  - 工作流完成后自动合并 Bot 的 PR（squash 方式）

### 5. Workflow Run Retry ([lib/workflow_run-retry.js](lib/workflow_run-retry.js))
- **触发事件**: `workflow_run.completed`
- **功能**: 定时任务或发布工作流失败时自动重试（最多 4 次）

### 6. Cleanup Action Caches ([lib/cleanup-action-caches.js](lib/cleanup-action-caches.js))
- **触发事件**: `pull_request.closed`
- **功能**: PR 关闭后自动清理关联的 GitHub Actions 缓存

## 技术栈

- **运行时**: Node.js 25 (ES Module)
- **框架**: Probot 14.x
- **测试**: Jest 30.x
- **依赖**:
  - `@actions/core` - GitHub Actions 工具库
  - `ignore` - 忽略规则匹配
  - `release-drafter-github-app` - 版本信息解析

## 开发命令

```bash
# 启动开发服务器
npm start

# 运行测试
npm test
```

## 部署

### Docker 部署
```bash
docker build -t ihub-bot .
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<private-key> ihub-bot
```

### 环境变量
- `APP_ID` - GitHub App ID
- `PRIVATE_KEY` - GitHub App 私钥
- `WEBHOOK_SECRET` - Webhook 密钥（可选）

## GitHub App 权限

| 权限 | 级别 |
|------|------|
| contents | read |
| issues | write |
| pull_requests | read |
| statuses | write |

## 事件订阅

- `issues`
- `milestone`
- `pull_request`
- `push`
- `workflow_run`

## 相关链接

- GitHub App: https://github.com/apps/ihub-bot
- 仓库: https://github.com/ihub-pub/bot