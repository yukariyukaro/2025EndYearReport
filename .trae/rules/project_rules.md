
# 2025 年度总结项目开发指南 (Agent.md)

本文档旨在指导 AI 助手及开发人员理解项目架构、核心规范与开发流程，确保后续开发的一致性与高质量。

## 1. 项目概览

### 1.1 目标与背景
本项目为“2025 年度总结”H5 页面，基于 Next.js (App Router) + React 构建。核心体验为单页全屏滚动（Scroll Snap），通过渐进式挂载（Progressive Mounting）与统一节奏控制（PageManager）实现流畅的叙事体验。

### 1.2 技术栈
- **框架**: Next.js 16 (App Router)+pnpm
- **UI**: React 19 (Server/Client Components 混合)
- **样式**: CSS Modules (已废弃) -> 全局 CSS (`app/globals.css`) + CSS Variables
- **状态管理**: React Context (`PageManagerProvider`)
- **动画**: CSS Transitions/Animations + IntersectionObserver

### 1.3 目录结构
```
tripleuni-2025-yearreport-frontend/
├── app/
│   ├── layout.tsx       # 根布局（包含全局 Footer）
│   ├── page.tsx         # 首页入口（集成 PageManagerProvider, Pages）
│   └── globals.css      # 全局样式与动画定义
├── components/
│   ├── PageManagerProvider.tsx # 核心节奏控制器（Context, Observer, Scroll Logic）
│   ├── PageWrapper.tsx         # 页面段容器（处理点击推进、注册、生命周期）
│   ├── Pages.tsx               # 页面列表渲染（基于 isActive 条件渲染）
│   ├── ScrollUpHint.tsx        # 滚动提示组件
│   ├── Footer.tsx              # 全局页脚
│   ├── MusicToggle.tsx         # 音乐开关
│   └── pages/                  # 具体页面段组件
│       ├── page1.tsx
│       ├── page2.tsx
│       └── Template.tsx        # 新页面模板
├── hooks/
│   └── usePageManager.ts       # 消费 Context 的 Hook
└── utils/
    └── dom.ts                  # DOM 操作与统计工具
```

## 2. 架构规范

### 2.1 核心节奏控制 (PageManager)
所有页面段的挂载、滚动、触发逻辑均由 `PageManagerProvider` 统一管理，严禁在页面组件内私自实现 IntersectionObserver 或滚动监听。

- **状态**: `showUpTo` (当前渲染到的最大页码)。
- **API**:
  - `appendNextPage(by, scrollTo)`: 推进到下一页（仅当 `by === showUpTo` 时生效）。
  - `onEnterViewportForFirstTime(page, action)`: 注册首次进入视口的回调（用于触发动画）。
  - `isActive(page)`: 判断页面是否应渲染。
  - `onAppendNext(page, cb)`: 订阅“进入下一页”事件（用于隐藏提示）。

### 2.2 推进机制 (Advance Logic)
进入下一页有两种统一方式，均由上层处理，页面段无需编写逻辑：
1. **整页点击**: `PageWrapper` 绑定了 `onClickCapture`，点击非交互区域自动调用 `appendNextPage`。
2. **滚动/触摸阈值**: `PageManagerProvider` 监听容器滚动/触摸，幅度超过阈值（约 25% 视口高度）自动推进。

### 2.3 页面段开发规范
- **文件位置**: `components/pages/pageX.tsx`。
- **容器**: 必须使用 `<PageWrapper pageNumber={N} onShow={handleShow} onAppendNext={...}>` 包裹内容。
- **动画**: 使用 `onShow` 回调触发 CSS 动画（如添加 `.reveal-line` 类）。
- **提示**: 使用 `<ScrollUpHint />`，并通过 `onAppendNext` 回调控制隐藏。
- **禁止**: 禁止在页面内直接操作 `window.scroll` 或监听 `scroll` 事件。

### 2.4 样式规范
- **文件**: 统一维护在 `app/globals.css`。
- **命名**: 使用 BEM 风格或语义化类名（如 `.page`, `.content-block`, `.reveal-line`）。
- **变量**: 使用 CSS Variables (`--clr-primary`, `--fs-large`) 保持一致性。
- **适配**: 移动优先，使用 `clamp()` 处理响应式尺寸。

## 3. 开发指南

### 3.1 新增页面
1. 复制 `components/pages/Template.tsx` 为 `pageX.tsx`。
2. 修改 `PAGE_NUMBER` 常量。
3. 在 `components/Pages.tsx` 中导入并添加到 `PAGES` 数组。
4. 在 `app/globals.css` 添加特定样式（如背景色、装饰图）。

### 3.2 修改节奏/交互
- 若需调整滚动阈值或冷却时间，修改 `components/PageManagerProvider.tsx` 内部常量。
- 若需调整点击过滤规则（如新增忽略元素），修改 `components/PageWrapper.tsx` 的 `shouldIgnoreClick`。

### 3.3 调试与验证
- **PC 端**: 使用鼠标滚轮或点击页面测试推进；检查控制台无报错。
- **移动端**: 使用触摸上滑测试推进；检查 `touchstart/touchend` 逻辑。
- **性能**: 关注 `IntersectionObserver` 触发频率与重绘开销。



请遵循此文档进行后续开发，保持代码库的整洁与架构的一致性。
开发页面时，必须参考已有页面在页面末尾必须添加ScrollUpHint。