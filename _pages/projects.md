---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

{% include base_path %}

Here are some of my featured projects.

<div style="display: flex; flex-direction: column; gap: 24px; margin-top: 24px;">

  <!-- Vision-Foundation-Model Project -->
  <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;" class="project-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
      <h3 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #1e293b;"><a href="/VFM/" style="color: #1e293b; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#4f46e5'" onmouseout="this.style.color='#1e293b'">Vision-Foundation-Model (视觉基础模型指南与实现)</a></h3>
      <span style="background: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Available & Ongoing</span>
    </div>
    <p style="margin: 12px 0 0 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      针对计算机视觉领域核心的<strong>视觉基础模型 (Vision Foundation Models, VFMs)</strong> 进行了系统的梳理和研究。涵盖了视觉-语言多模态对齐（CLIP 系列，包括基线 CLIP、OpenCLIP、FLIP、CLIPA、EVA-CLIP、SigLIP 等）、自监督表征学习（DINO v1/v2/v3 家族）以及开集目标定位（DINO-DETR, Grounding DINO）等经典与前沿方案。
    </p>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      本地仓库中包含了上述所有 Available 模型的 PyTorch 纯享版从零代码实现，并配备了 DINOv3 空间结构格拉姆锚定（Gram Anchoring）特征相关的交互式可视化 Demo。其余分割（SAM2/SAM3）、重建、具身智能（RDT-1B）等模型正在火热开发集成中。
    </p>
    <div style="margin-top: 16px;">
      <a href="/VFM/" style="color: #4f46e5; font-weight: 600; text-decoration: none; text-underline-offset: 4px;">访问项目技术指南 &amp; 代码复现 →</a>
    </div>
  </div>

  <!-- Project 1 -->
  <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;" class="project-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
      <h3 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #1e293b;">LIBERO-Spatial 多任务行为克隆项目</h3>
      <span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">2026年4月</span>
    </div>
    <p style="margin: 12px 0 0 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      <strong>研究目标与基准：</strong>项目基于 libero_spatial 机器人操作基准，针对核心任务（Task ID: 0, 1, 5, 6）进行多任务行为克隆（Multi-Task BC）策略的研究；策略输入包含智能体 RGB 视角图像及机器人低维状态，输出为 7 维连续动作空间。
    </p>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      <strong>实验设计与模型演进：</strong>实验从一个仅有 0.2M 参数的简单基础模型（采用 3 层普通 CNN）出发，并探索了无指示消融实验；随后通过引入在 ImageNet 上预训练的 ResNet-18 作为图像编码器，将模型参数扩展至 11.4M 以提升性能。
    </p>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      <strong>结果分析与主要局限：</strong>实验结果显示，引入预训练的 ResNet-18 使条件策略的平均闭环成功率从 0.175 大幅提升至 0.475；但所有模型在涉及堆叠物体和需要高精度垂直接近的“任务 5”上成功率均为 0，诊断局限源于单帧反应式策略缺乏时间上下文与触觉反馈。
    </p>
  </div>

  <!-- Project 2 -->
  <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;" class="project-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
      <h3 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #1e293b;">Aura: 本地优先的 AI 驱动型 LaTeX 智能学术开发软件</h3>
      <span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">2025年10月</span>
    </div>
    <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      <li><strong>基于层级多智能体（Multi-Agent）的协同处理架构：</strong>利用 Pydantic AI 框架与 main.py 设计并实现了双层 Agent 架构；由主代理 pydantic_agent.py 负责全局任务规划，动态分发至专职的子代理；利用 SSE 协议实现 AI 思考流与工具调用的前端实时无感渲染，并引入人机协同（HITL）审批机制，保障高风险操作的安全可控。</li>
      <li><strong>全自动学术文献调研与假说生成引擎：</strong>设计并实现了 5 阶段自主文献调研流（SCOPING → DISCOVERY → SYNTHESIS → IDEATION → EVALUATION）；对接 Google Scholar、arXiv 和 Semantic Scholar API，实现跨源学术搜索与引用树图谱深度遍历；结合 PyMuPDF 全文解析 PDF，提取关键技术并自动识别研究 Gap，最终自主生成带有创新度与可行性评分的假说，并输出排版完美的 LaTeX 调研报告。</li>
      <li><strong>沙箱化编译环境与智能编译纠错管线：</strong>基于 Docker 构建了隔离的 LaTeX（TeXLive）Dockerfile 编译沙箱，保障排版结果的跨平台一致性；开发了智能纠错管线，实现 LaTeX 文档结构解析、BibTeX 引用自动化管理和算法伪代码一键生成，并基于编译日志诊断功能，驱动 Compiler Agent 自动定位并一键修复 LaTeX 编译错误。</li>
      <li><strong>极致体验的本地桌面级 IDE 与多端云同步：</strong>采用 Electron + Next.js 混合架构，在本地构建响应式 macOS 桌面应用；集成 Monaco Editor 实现 LaTeX 语法高亮与 IntelliSense 智能补全，利用 react-pdf 和 Streamdown 支持 PDF 与 Markdown 双通道实时低延迟预览，并实现 Git 与 Overleaf 双向同步。</li>
    </ul>
  </div>

  <!-- Project 3 -->
  <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;" class="project-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
      <h3 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #1e293b;">AI儿童定制化智能创作平台</h3>
      <span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">2025年1月 - 2025年4月</span>
    </div>
    <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #475569; font-size: 0.95rem; line-height: 1.6;">
      <li>主导开发支持儿童自主设计与收藏标准化高品质产品的智能应用。采用 Vue.js 前端 + Python Flask 后端架构，集成 pyvis 绘图面板、封装组件库及 Deepseek-R1 对话机器人。</li>
      <li>构建 AI 艺术生成 pipeline，通过 CLIP-Interrogator 生成高精度提示词并结合深度图的 ControlNet 控制，融合定制化 LoRA 模型（水墨风格）与微调 HunyuanDiT 模型（青花瓷），实现从粗略的儿童绘画到中国风艺术品的语义转化，保留原始特征的同时提升风格迁移精度。</li>
      <li>实现双模 3D 定制功能：基于 Python trimesh 库开发个性化筷子建模模块；集成 SF3D AI 3D 模型生成算法，支持从草图生成玩具或筷子的可打印 3D 模型，拓展儿童创作维度与产品落地可能性。</li>
    </ul>
  </div>

</div>
