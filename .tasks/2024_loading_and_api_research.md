# 背景

文件名：2024_loading_and_api_research.md

创建于：2026-01-02

创建者：USER

Yolo模式：Off

# 任务描述

参考 24 年年度总结项目（Nuxt/Vue），为 25 年年度总结项目增加加载动画并调用后端接口。研究重点：

1. 24 年项目如何调用后端接口并设置加载动画，保证数据获取完毕、页面渲染充分后再显示。
2. 重点阅读并分析：
   - d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\composables\useSummary.js
   - d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\components\page\1.vue

后端接口（25 年）：https://api.uuunnniii.com/v4/report2025/get.php?user_itsc=ivanfan&user_school_label=HKU

# 项目概览

当前仓库包含两套前端：

- TripleUNI-2024-YearReport-Frontend：Nuxt/Vue 单页滚动年度总结（本次研究对象）。
- 根目录 app/components：25 年项目（Next.js/React），本轮仅做参考，不进行实现。

⚠️ 警告：永远不要修改此部分 ⚠️

- 我必须在每个响应开头声明模式（如 [MODE: RESEARCH]）。
- 未经用户明确指令不得从 RESEARCH 切换到其他模式。
- RESEARCH 阶段只做信息收集与代码调查：允许搜索/阅读/追踪流程；禁止提出解决方案、规划、实施与写代码。
- 必须基于代码与可验证信息陈述，不能猜测。

⚠️ 警告：永远不要修改此部分 ⚠️

# 分析

## 24 年项目：后端接口调用链路

入口在 app.vue 的 onMounted：直接调用 useSummary().fetchSummary()，不做 await。

fetchSummary 的关键行为（useSummary.js）：

- 数据容器：useState("summary", () => undefined)，用于跨页面共享（所有 page/*.vue 通过 useSummary() 读取同一份 summary）。
- 入参来源：从 window.location.search 读取 token。
- 请求方式：POST + Content-Type: application/x-www-form-urlencoded，body 仅包含 token。
- 请求地址：https://api.uuunnniii.com/v4/report2024/get.php
- 解析协议：response 作为字符串 JSON.parse，期望结构为 { data, code, msg }。
- 错误处理：
  - JSON.parse 失败：console.error + console.log(response) 后 return。
  - code !== 200：console.error + console.log(response)，并 alert：
    - code === 400：提示“无法找到你的年度总结数据, 明年再来吧!”
    - 其他：提示“我们遇到了一个错误, 请稍后重试.”并拼接 msg/code
  - data falsy：console.error + console.log(response) 后 return。
- 成功时：summary.value = data；随后 setAppName(data.user_school_label) 写入 appName（另一个 useState）。

相关代码位置：

- app.vue：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\app.vue
- fetchSummary：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\composables\useSummary.js

## 24 年项目：加载动画/等待逻辑

24 年项目的“等待数据获取完毕再进入叙事”的实现集中在第一页（page/1.vue），而不是全局阻塞渲染：

1) 页面初始就渲染 Page1（showUpTo 初始为 1），用户可见“立即开始”。

2) 点击“立即开始”后才决定是否显示 loading overlay：

- isLoaded = computed(() => summary.value != undefined)
- showLoading 初始 false
- handelStart() 内：若 !isLoaded.value，则 showLoading.value = true 并 return
- template 中 overlay 显示条件：v-if="!isLoaded && showLoading"，因此它只在“用户已触发开始 + 数据尚未到位”时出现

3) 数据到位后自动继续“开始”流程：

- watch(isLoaded, (newVal) => { if (newVal && showLoading.value) { handelStart(); } })
- 当 isLoaded 变为 true：
  - overlay 自动消失（因为 v-if 依赖 !isLoaded）
  - 立刻进入后续动画/翻页逻辑（start 动画、appendNextPage 定时触发）

4) “页面渲染充分后再显示”的实际含义（就现有实现而言）：

- 以 summary 数据是否存在作为唯一门槛；没有发现等待图片、字体、音频等静态资源完全加载的逻辑。
- 第一页的视觉内容（背景/装饰图）始终可见；只有在用户点击开始且数据未到时才遮罩。

相关代码位置：

- page/1.vue：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\components\page\1.vue
- PAGES/showUpTo：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\composables\useManagePages.js

## 24 年项目：AI 内容的“按需加载 + 局部等待”模式

除了首页的“拿到 summary 再继续”，项目内还有第二种等待模式：AI 内容字段晚于 summary 补齐。

- fetchAIContent（useSummary.js）：
  - 前置：summary.value 存在才继续
  - 若 summary 已含 ai_description/ai_image/ai_title 则直接 return
  - POST 到 https://api.uuunnniii.com/v4/report2024/ai.php（body 同样只有 token）
  - 解析 JSON 后直接写回 summary.value.ai_description / ai_image / ai_title

- 触发点：page/6.vue 的 onShowPage2() 内调用 fetchAIContent()（不 await）。

- 等待/呈现：page/18.vue
  - contentReady computed 检查 summary.value && ai_image && ai_description && ai_title
  - 若 ready：延时后直接 displayAIContent()
  - 若不 ready：先显示 .loader，再 watch(contentReady)；一旦 true，延时 1s 调用 displayAIContent()

相关代码位置：

- fetchAIContent：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\composables\useSummary.js
- 调用点：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\components\page\6.vue
- 等待与 loader UI：d:\works\tripleuni-2025-yearreport-frontend\TripleUNI-2024-YearReport-Frontend\components\page\18.vue

## 25 年接口样例（与 24 年协议的差异）

给定的 25 年接口样例返回：

{"success":false,"error":"数据库错误","message":"SQLSTATE[HY000]: General error: 1 no such column: ai_description"}

可观察到的差异：

- 25 年接口示例为 GET + query 参数（user_itsc/user_school_label），而 24 年为 POST + token。
- 返回字段为 success/error/message，与 24 年 {code,msg,data} 不同。
- 错误信息表明后端当前查询引用 ai_description 列但数据库无该列（需要后端侧修复后才能拿到数据）。

# 提议的解决方案

## 25 年项目对接思路（PLAN）

### 目标 1：在 25 年项目中调用接口并提供可复用的数据源

1) 以 React Context 方式实现“全局 summary 状态”，对齐 24 年 useState("summary") 的跨页面共享能力，但遵循 React 最佳实践：

- 新增 Provider：components/SummaryProvider.tsx（Client Component）。
- 新增消费 Hook：hooks/useSummary.ts（返回 context，类似 hooks/usePageManager.ts）。
- Provider 内维护状态机：idle/loading/success/error（或等价的 status 字段），并暴露：
  - summary（后端数据，未就绪时为 null）
  - isLoaded（summary != null）
  - error（结构化错误：message + raw）
  - fetchSummary（幂等：已加载/正在加载时不重复请求）
  - reset/retry（可选，便于失败重试）

2) URL 参数读取策略（Next.js App Router + Client Component）：

- 使用 next/navigation 的 useSearchParams 在 Provider 内读取 user_itsc / user_school_label。
- 形成唯一请求 key（itsc + schoolLabel），当 key 变化时重置状态并重新拉取。

3) 网络请求落点（最佳实践 + CORS 风险控制）：

- 优先通过 Next Route Handler 做同源代理：app/api/report2025/get/route.ts。
  - 由 route.ts 去请求 https://api.uuunnniii.com/v4/report2025/get.php?user_itsc=...&user_school_label=...
  - Route Handler 负责参数校验、透传响应、统一错误码与 JSON 结构。
- 客户端 Provider 只请求同源 /api/report2025/get?...，避免浏览器 CORS 与直连不稳定。

4) 响应结构适配（与 24 年 code/msg/data 差异）：

- 兼容后端返回 { success, error, message, data? }。
- 当 success === false 时：
  - error.message 采用 message 字段；
  - summary 保持 null；
  - status 置为 error。
- 当前接口样例返回数据库错误（no such column: ai_description），在前端应表现为“失败可重试/无法生成数据”的稳定 UI，而不是页面卡死。

### 目标 2：将 24 年的加载动画引入 25 年（App 启动 Gate）

新的需求：App 启动后立刻请求后端接口，并同步显示加载动画；当“数据 + 加载动画准备完毕”后，才展示第一页内容。

因此迁移策略从“Page1 点击开始 Gate”调整为“全局启动 Gate”：

1) SummaryProvider 在应用启动时自动发起请求（不依赖用户点击）：

- Provider mount 后 useEffect 立刻读取 URL search params（user_itsc/user_school_label）。
- key 可用 itsc + schoolLabel，key 可用时立即触发 fetchSummary。
- fetchSummary 需要幂等去重，避免 React 严格模式/重复渲染导致重复请求。

2) LoadingOverlay 在 App 启动阶段全局覆盖展示：

- overlay 组件始终可渲染在 app/page.tsx（或 Layout 内），优先级高于页面内容。
- overlay 显示条件：summaryStatus !== 'success' 或 bootDelay 未完成。

3) “加载动画准备完毕”的判据（避免闪屏）：

- 引入最小展示时长（例如 600ms 或 800ms），即使数据很快返回也至少展示一段时间。
- bootReady = (summaryStatus === 'success') && minDelayElapsed。

4) 为避免页面在 overlay 期间提前触发 onShow 动画：

- 在 bootReady 为 false 时不挂载 PageManagerProvider/Pages（页面树完全不渲染）。
- bootReady 为 true 后再渲染 PageManagerProvider + Pages，确保第一页的 onShow/动画从“真正显示时”开始。

参考源：

- 24 年加载遮罩 DOM + 文案 + spinner：TripleUNI-2024-YearReport-Frontend/components/page/1.vue
- 24 年遮罩 CSS：同文件的 .loading-overlay/.loading-spinner/.loading-animation/keyframes

25 年落点：

- app/page.tsx：用 boot gate 控制“先 overlay，后渲染 PageManagerProvider/Pages”。
- app/globals.css：引入 loading overlay 样式（全局类名复用 24 年）。

### 目标 3：保证修改符合 React/Next.js 最佳实践（约束与策略）

1) 关注点分离：

- 页面节奏与滚动：继续由 PageManagerProvider/usePageManager 管理；不把数据获取逻辑塞进 PageManagerProvider。
- 数据获取与缓存：由 SummaryProvider 统一管理；页面只消费 summary 与状态。

2) 幂等与竞态：

- fetchSummary 需要去重（inFlightRef / AbortController 可选），避免重复点击开始造成并发请求与状态错乱。
- 请求与 URL 参数绑定：参数变化时取消/忽略旧请求结果。

3) 渲染与副作用：

- 仅在 useEffect 中触发网络请求与“数据到位后自动推进”。
- 避免在 render 中调用 Date.now / document / window（如需稳定值使用 useState initializer；参考 components/pages/expample.tsx 现有写法）。

4) 类型与数据边界：

- 为 summary 定义最小可用 TypeScript 类型（至少覆盖目前页面会读到的字段），未知字段用 index signature 或 Partial 扩展。
- 对缺失字段保持容错渲染（nullish coalescing / 条件渲染），避免运行时崩溃。

5) 与 24 年 Nuxt 差异的迁移原则：

- Nuxt 的 useState 是全局 store；Next/React 用 Context 或外部 store 实现。
- Nuxt 的 watch 对应 React 的 useEffect 依赖变化。
- Nuxt 的 v-if/v-show 对应 React 条件渲染与 CSS 控制显示。

## 需要遵守的仓库规范

- 25 年项目架构规范见：d:\works\tripleuni-2025-yearreport-frontend\.trae\rules\project_rules.md
- 页面推进逻辑必须继续走 PageWrapper/PageManagerProvider，不在页面内监听滚动。
- 样式优先放在 app/globals.css（如果必须用 CSS Module，也要保持类名与变量风格统一）。

## 测试方案（PLAN）

自动化：

- npm run lint
- npm run build

手工验证：

- 携带 URL 参数 user_itsc/user_school_label 进入首页：Page1 可正常显示。
- 打开页面立刻显示 loading overlay（无需点击）。
- 数据成功返回后：overlay 至少显示 minDelay；随后消失并展示第 1 页。
- overlay 展示期间：第 1 页及后续页不应被渲染/不应触发 onShow 动画。
- 接口返回 success=false（当前样例会发生）：overlay 或错误屏应稳定展示错误信息并支持重试。

### 实施清单：

1. 新增 SummaryProvider 与 useSummary Hook（Context + 状态机 + 幂等 fetch）。
2. 新增 Next Route Handler：/api/report2025/get，完成参数校验与外部接口代理。
3. 在 app/page.tsx 中挂载 SummaryProvider，确保所有页面可消费数据。
4. 在 app/page.tsx 增加启动 Gate：先显示 overlay，bootReady 后再挂载 Pages。
5. 在 app/globals.css 引入 24 年加载动画样式（overlay/spinner/ellipsis）。
6. 为错误态设计 UI：success=false 或网络失败时可提示并支持重试。
7. 运行 npm run lint 与 npm run build，修复所有报错。
8. 手工验证：正常数据、错误数据、重复点击、移动端滚动/点击推进行为。

# 当前执行步骤："2. 分析与任务相关的代码"

# 任务进度

2026-01-02

- 已阅读：TripleUNI-2024-YearReport-Frontend/app.vue
- 已阅读：TripleUNI-2024-YearReport-Frontend/composables/useSummary.js
- 已阅读：TripleUNI-2024-YearReport-Frontend/components/page/1.vue
- 已阅读：TripleUNI-2024-YearReport-Frontend/composables/useManagePages.js
- 已阅读：TripleUNI-2024-YearReport-Frontend/composables/useUtils.js
- 已阅读：TripleUNI-2024-YearReport-Frontend/components/page/6.vue
- 已阅读：TripleUNI-2024-YearReport-Frontend/components/page/18.vue

# 最终审查

(待补充)

