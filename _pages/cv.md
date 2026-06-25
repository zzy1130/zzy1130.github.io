---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[下载中文简历 (PDF)](/files/resume_zh.pdf)

教育背景
======
* **香港大学** (计算机科学，本科) — 2021年9月 -- 2025年6月
* **香港大学** (控制工程，研究型硕士 ｜ 导师：James Lam教授) — 2025年9月 -- 2027年6月 (预计)

实习经历
======
* **深圳新言意码科技有限公司** ｜ 算法实习生 — 2025年9月 -- 2026年4月
  * **YouWare Appraiser Benchmark 构建**：基于 FastAPI + React + SQLAlchemy 异步架构，设计并实现 7 阶段评测流水线，比较 Opus、Sonnet、GLM 等主流大模型接入 YouWare Agent 的生成能力；开发 Docker 智能体管理器，支持通过 Git Worktree 动态拉取多分支代码构建镜像，实现并发安全调度与环境隔离；设计 Meta/Run 双库隔离及 S3 自动上传与 Playwright 截图，实现一键预览；引入 HITL 反馈机制进行一致性校准，提升 AI Judge 的准确性。
  * **Curator 负面事件分析系统与 ARE 自进化框架**：通过 Curator 定期监控 dislike、revert 等负面事件；利用 LLM 分析每日负面 trajectory 中的函数/工具调用模式，提炼反思经验；设计多阶段合并管道，利用语义经验聚类（分类与并查集算法），结合大模型合成与 8 条结构性硬规则校验、自审机制提炼合并为高质量 AREContract 并加载至 system prompt 中进行回测，实现性能闭环提升。

* **上海交通大学人工智能安全实验室** ｜ 算法研究实习生 — 2024年6月 -- 2024年8月
  * 系统梳理 15 种主流深度伪造检测模型架构，完成代码复现与消融实验，通过跨数据集验证揭示各方法在 FF++ 等基准数据集上的性能。
  * 构建覆盖 15 种 SOTA 检测方法的系统性基准框架，开发 Python Flask 后端接口，提供可视化分析看板实现检测结果。
  * 研究并分析了适用于深度伪造检测的在线学习算法，以增强基准中的模型在不断演变的数据集中的适应性和性能。

项目经验
======
* **LIBERO-Spatial 多任务行为克隆项目** — 2026年4月
  * **研究目标与基准：**项目基于 libero_spatial 机器人操作基准，针对核心任务（Task ID: 0, 1, 5, 6）进行多任务行为克隆（Multi-Task BC）策略的研究；策略输入包含智能体 RGB 视角图像及机器人 low-dim 状态，输出为 7 维连续动作空间。
  * **实验设计与模型演进：**实验从一个仅有 0.2M 参数的简单基础模型（采用 3 层普通 CNN）出发，并探索了无指示消融实验；随后通过引入在 ImageNet 上预训练的 ResNet-18 作为图像编码器，将模型参数扩展至 11.4M 以提升性能。
  * **结果分析与主要局限：**实验结果显示，引入预训练的 ResNet-18 使条件策略的平均闭环成功率从 0.175 大幅提升至 0.475；但所有模型在涉及堆叠物体和需要高精度垂直接近的“任务 5”上成功率均为 0，诊断局限源于单帧反应式策略缺乏时间上下文与触觉反馈。

* **Aura：本地优先的 AI 驱动型 LaTeX 智能学术开发软件** — 2025年10月
  * **基于层级多智能体（Multi-Agent）的协同处理架构：**利用 Pydantic AI 框架与 main.py 设计并实现了双层 Agent 架构；由主代理 pydantic_agent.py 负责全局任务规划，动态分发至专职的子代理（文献检索、沙箱编译、任务规划、文档分析）；利用 SSE 协议实现 AI 思考流与工具调用的前端实时无感渲染，并引入人机协同（HITL）审批机制，保障高风险操作的安全可控。
  * **全自动学术文献调研与假说生成引擎：**设计并实现了 5 阶段自主文献调研流（SCOPING → DISCOVERY → SYNTHESIS → IDEATION → EVALUATION）；对接 Google Scholar、arXiv 和 Semantic Scholar API，实现跨源学术搜索与引用树图谱深度遍历；结合 PyMuPDF 全文解析 PDF，提取关键技术并自动识别研究 Gap，最终自主生成带有创新度与可行性评分的假说，并输出排版完美的 LaTeX 调研报告。
  * **沙箱化编译环境与智能编译纠错管线：**基于 Docker 构建了隔离的 LaTeX（TeXLive）Dockerfile 编译沙箱，保障排版结果的跨平台一致性；开发了智能纠错管线，实现 LaTeX 文档结构解析、BibTeX 引用自动化管理和算法伪代码一键生成，并基于编译日志诊断功能，驱动 Compiler Agent 自动定位并一键修复 LaTeX 编译错误。
  * **极致体验的本地桌面级 IDE 与多端云同步：**采用 Electron + Next.js 混合架构，在本地构建响应式 macOS 桌面应用；集成 Monaco Editor 实现 LaTeX 语法高亮与 IntelliSense 智能补全，利用 react-pdf 和 Streamdown（集成 KaTeX 与 Mermaid）支持 PDF 与 Markdown 双通道实时低延迟预览，并实现 Git 与 Overleaf 双向同步，打通本地与云端写作协作流。

* **AI儿童定制化智能创作平台** — 2025年1月 -- 2025年4月
  * 主导开发支持儿童自主设计与收藏标准化高品质产品的智能应用。采用 Vue.js 前端 + Python Flask 后端架构，集成 pyvis 绘图面板、封装组件库及 Deepseek-R1 对话机器人。
  * 构建 AI 艺术生成 pipeline，通过 CLIP-Interrogator 生成高精度提示词并结合深度图的 ControlNet 控制，融合定制化 LoRA 模型（水墨风格）与微调 HunyuanDiT 模型（青花瓷），实现从粗略的儿童绘画到中国风艺术品的语义转化，保留原始特征的同时提升风格迁移精度。
  * 实现双模 3D 定制功能：基于 Python trimesh 库开发个性化筷子建模模块；集成 SF3D AI 3D 模型生成算法，支持从草图生成玩具或筷子的可打印 3D 模型，拓展儿童创作维度与产品落地可能性。

奖项与荣誉
======
* **丘成桐中学科学奖** (基于 YOLOv3 网络和 ResNet 的人体跌倒检测项目) — 2019年11月
* **澳大利亚数学竞赛二等奖（前25%）** — 2019年9月
* **入围奥纬咨询商赛——2022年中国大陆案例竞赛前100强团队** — 2019年5月

技能
======
* **编程语言**: Python, C++, Java, Shell Script; LaTeX, SQL, HTML5, CSS, JavaScript, PHP, Vue.js
* **技术知识**: 数据库管理，网络编程，计算机视觉，自然语言处理，网络安全, 数字图像处理, 强化学习
* **语言**: 英语 (托福 107 分), 粤语

学术论文
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
