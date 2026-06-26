# Agent Reach 图形控制台

这是一个面向 `agent-reach` skill 的本地 Web 图形界面和 Makefile 命令入口。项目把 skill 中分散的搜索、社交平台、网页读取、GitHub、招聘、视频转录、金融页面和环境诊断能力整理成统一的可视化运行器。

默认运行地址：

```text
http://localhost:4173
```

## 能力解读

`agent-reach` 本质上是给 agent 使用的互联网能力路由器。它的重点不是替代平台客户端，而是根据用户意图选择正确的后端工具，并在平台登录态、风控、接口变化或命令失败时给出可执行的替代路径。

该 skill 主要面向读取和调研场景，覆盖：

- 全网搜索和技术搜索
- 通用网页读取和 RSS 读取
- 小红书、Twitter/X、B 站、V2EX、Reddit 等社交/社区内容读取
- GitHub 仓库、代码、issue、PR、CI、release 查询
- LinkedIn 人才、职位、个人和公司资料读取
- YouTube 字幕、评论、元数据和搜索
- B 站视频、字幕、音频、热门和排行榜
- 小宇宙播客转录
- 雪球金融页面读取
- Agent Reach 环境诊断和更新检查

它明确不适合发帖、评论、点赞、绕过平台限制或替代登录认证。需要登录态的平台仍然需要本机工具链和浏览器登录状态。

## 前端界面

前端已切换为简体中文，`html` 语言标记为 `zh-CN`。界面包含：

- 顶部导航：能力、运行器、命令入口
- 首页主视觉：展示当前生成的命令
- 能力卡片：按系统、搜索、网页、金融、开发、招聘、社交、视频分类筛选
- 运行器：根据能力动态生成参数输入框
- 输出窗口：显示命令、标准输出和错误输出
- 隐藏命令面板：按 `Ctrl+K` 打开 Makefile 风格命令入口

界面设计遵循 `design-taste-frontend` 指南，采用 Apple 风格的浅色视觉、玻璃拟态面板、单一蓝色强调色、统一圆角体系和响应式网格布局。玻璃效果是 Web 近似实现，不使用 Apple 私有代码或资产。

## 快速启动

```bash
node server.js
```

然后打开：

```text
http://localhost:4173
```

## CLI 用法

项目提供 Makefile 作为规范命令入口：

```bash
make help
make serve
make doctor
make update-check
make search QUERY="agent reach"
make code QUERY="code question"
make web URL="https://example.com"
make github QUERY="agent reach"
make youtube URL="https://youtube.com/watch?v=VIDEO_ID"
make v2ex
make bili QUERY="AI tools"
make twitter QUERY="agent reach"
make reddit QUERY="LocalLLaMA"
make xhs QUERY="AI workflow"
make run ID="github-prs" ARGS="--repo owner/repo"
make command ID="youtube-comments" ARGS="--url https://youtube.com/watch?v=VIDEO_ID"
make package
```

如果当前 Windows 环境没有安装 `make`，可以直接使用 Node CLI：

```bash
node scripts/agent-reach-cli.js help
node scripts/agent-reach-cli.js command exa-web --query "agent reach"
node scripts/agent-reach-cli.js run doctor
```

## 能力分类

| 分类 | 覆盖能力 | 底层命令族 |
| --- | --- | --- |
| 系统 | 环境诊断、更新检查 | `agent-reach doctor --json`、`agent-reach check-update` |
| 搜索 | Exa 网页搜索、Exa 代码上下文 | `mcporter call exa.*` |
| 网页 | Jina Reader、Web Reader MCP、RSS 预览 | `curl r.jina.ai`、`mcporter call web-reader.*`、Python `feedparser` |
| 金融 | 雪球搜索、雪球股票页 | `curl r.jina.ai` |
| 开发 | GitHub 仓库、代码、issue、PR、Actions、release、API | `gh search`、`gh issue`、`gh pr`、`gh run`、`gh release`、`gh api` |
| 招聘 | LinkedIn 人才、职位、个人资料、公司资料 | `mcporter call linkedin-scraper.*` |
| 社交 | 小红书、Twitter/X、Reddit、V2EX | `opencli`、`twitter`、`xhs`、`rdt`、`curl` |
| 视频 | YouTube、B 站、媒体转录、小宇宙播客 | `yt-dlp`、`bili`、`opencli`、`agent-reach transcribe` |

当前 Web 图形界面通过 `/api/capabilities` 暴露 69 个白名单能力模板。浏览器不会提交任意 shell 文本，只提交能力 ID 和参数。

## 安全模型

服务端只执行 `scripts/agent-reach-core.js` 中定义的固定命令模板：

- 浏览器提交 `{ id, params }`
- 服务端按 `id` 查找能力模板
- 参数只进入对应模板位置
- 使用 `child_process.spawn` 且 `shell: false`
- 未注册的能力 ID 会被拒绝

如果要把服务暴露到 localhost 之外，必须先审查白名单、认证模型和网络边界。

## 依赖工具

只需要安装你实际使用路线对应的工具：

- `agent-reach`
- `mcporter` 和相关 MCP 通道，例如 Exa、Web Reader、LinkedIn、小红书
- `opencli`，用于浏览器登录态相关平台
- `twitter-cli`
- `gh`
- `yt-dlp`
- `bili` 或 `bilibili-cli`
- `curl`
- Python 与 `feedparser`
- `ffmpeg`
- Groq 或 OpenAI key，用于转录路线

雪球金融路线因为当前 skill 只有 finance trigger、没有独立 finance reference，所以通过 Jina Reader 读取公开页面。

## 开源文档与外部参考

本项目使用或引用了以下公开工具和文档：

- Agent Reach：`https://github.com/Panniantong/Agent-Reach`
- Exa MCP 命令示例，通过 `mcporter` 调用
- Jina Reader：`https://r.jina.ai/`
- GitHub CLI：`https://cli.github.com/`
- yt-dlp：`https://github.com/yt-dlp/yt-dlp`
- OpenCLI 命令示例，来自 Agent Reach skill references
- Bilibili CLI 命令示例，来自 Agent Reach skill references
- V2EX 公开 API：`https://www.v2ex.com/api/`
- Node.js 内置模块：`http`、`fs`、`path`、`child_process`、`zlib`
- MDN CSS 文档：Grid、`backdrop-filter`、`prefers-reduced-motion`
- Apple Human Interface Guidelines 仅作为视觉风格参考，没有引入 Apple 私有代码或素材

没有复制第三方项目源码片段。项目代码是围绕公开 CLI 命令和本地运行器重新实现的原创胶水层。

## 打包

```bash
node scripts/package.js
```

输出文件：

```text
dist/agent-reach-gui.tar.gz
```

## 项目结构

```text
agents.md
.gitignore
Makefile
README.md
package.json
server.js
public/
  index.html
  styles.css
  app.js
scripts/
  agent-reach-core.js
  agent-reach-cli.js
  check.js
  package.js
```

## GitHub 上传说明

按要求，本项目不自动执行上传操作。可以使用以下命令初始化并上传：

```bash
git init
git add .
git commit -m "Initial Agent Reach GUI"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 校验

```bash
node scripts/check.js
```

通过后会输出：

```text
Static checks passed.
```
