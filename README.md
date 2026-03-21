# IHub Bot

[![Vercel](https://vercelbadge.vercel.app/api/ihub-pub/bot)](https://vercel.com/)

基于 [Probot](https://probot.github.io/) 框架的 GitHub App，用于自动化管理 GitHub 仓库工作流。

## 功能模块

### Welcome

新 Issue 打开时自动发送欢迎评论。

### Check Milestone

检查 PR 是否设置了里程碑，创建提交状态检查。未设置里程碑时状态为 `pending`。

### Auto Milestone

- Release 发布时自动关闭同名里程碑
- 里程碑关闭时自动创建下一个版本里程碑
- PR 打开时自动设置里程碑（仅一个开放里程碑时）
- PR 未合并关闭时自动清除里程碑

### Auto Merge

- Bot 创建的 PR 自动审批（无其他审核者时）
- 工作流完成后自动合并 Bot 的 PR（squash 方式）

### Workflow Run Retry

定时任务或发布工作流失败时自动重试（最多 4 次）。

### Cleanup Action Caches

PR 关闭后自动清理关联的 GitHub Actions 缓存。

## 部署

### Docker

```bash
docker build -t ihub-bot .
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<private-key> ihub-bot
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `APP_ID` | GitHub App ID |
| `PRIVATE_KEY` | GitHub App 私钥 |
| `WEBHOOK_SECRET` | Webhook 密钥（可选） |

## GitHub App 配置

### 权限

| 权限 | 级别 |
|------|------|
| contents | read |
| issues | write |
| pull_requests | read |
| statuses | write |

### 事件订阅

- `issues`
- `milestone`
- `pull_request`
- `push`
- `workflow_run`

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 运行测试
npm test
```

## 相关链接

- GitHub App: https://github.com/apps/ihub-bot
- 仓库: https://github.com/ihub-pub/bot

## License

Apache-2.0