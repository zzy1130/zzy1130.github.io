---
layout: archive
title: "Vision Foundation Model (VFM) Guide"
permalink: /VFM/
author_profile: true
---

{% include base_path %}

这是一个聚焦于视觉基础模型（Vision Foundation Models, VFMs）技术演进与核心代码实现的研究型指南项目。项目针对主流的 VLM（视觉语言模型）、自监督学习、目标检测、分割及具身智能模型进行了系统的梳理，并在本地仓库中提供了核心模型的从零代码复现。

* 仓库链接：[GitHub - Vision-Foundation-Model](https://github.com/zzy1130/Vision-Foundation-Model)
* 本地项目路径：`/Users/zhongzhiyi/Vision-Foundation-Model`

---

## 🛠️ 模型指南概览 / Model Index

<table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.95rem;">
  <thead>
    <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
      <th style="padding: 12px; font-weight: 600;">类别 / Category</th>
      <th style="padding: 12px; font-weight: 600;">模型 / Model</th>
      <th style="padding: 12px; font-weight: 600;">状态 / Status</th>
      <th style="padding: 12px; font-weight: 600;">核心特性 / Core Feature</th>
      <th style="padding: 12px; font-weight: 600;">链接 / Link</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">图文对齐</td>
      <td style="padding: 12px; font-weight: 600; color: #4f46e5;">CLIP</td>
      <td style="padding: 12px;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Available</span></td>
      <td style="padding: 12px; color: #475569;">图像–文本共享语义空间</td>
      <td style="padding: 12px;"><a href="#1-clip-contrastive-language-image-pre-training-%E6%BC%94%E8%BF%9B">阅读指南</a></td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">表征学习</td>
      <td style="padding: 12px; font-weight: 600; color: #4f46e5;">DINO (v1/v2/v3)</td>
      <td style="padding: 12px;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Available</span></td>
      <td style="padding: 12px; color: #475569;">高层视觉特征，对 correspondence 很有帮助</td>
      <td style="padding: 12px;"><a href="#2-dino-%E8%87%AA%E7%9B%91%E7%9D%A3%E5%AD%A6%E4%B9%A0%E4%B8%8E%E6%A3%80%E6%B5%8B%E7%B3%BB%E5%88%97">阅读指南</a></td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">图文对齐</td>
      <td style="padding: 12px; font-weight: 600; color: #4f46e5;">SigLIP</td>
      <td style="padding: 12px;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Available</span></td>
      <td style="padding: 12px; color: #475569;">CLIP 类模型，Sigmoid 独立二分类损失</td>
      <td style="padding: 12px;"><a href="#15-siglip-from-softmax-to-sigmoid-loss-google-2023">阅读指南</a></td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">分割</td>
      <td style="padding: 12px; color: #64748b;">SAM / SAM2</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">点 / 框提示分割，SAM2 支持视频</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">分割追踪</td>
      <td style="padding: 12px; color: #64748b;">SAM3</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">图像与视频级持续分割</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">3D 重建</td>
      <td style="padding: 12px; color: #64748b;">SAM3D</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">资产 / 场景 / 人体重建</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">开放词表检测</td>
      <td style="padding: 12px; font-weight: 600; color: #4f46e5;">Grounding-DINO</td>
      <td style="padding: 12px;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Available</span></td>
      <td style="padding: 12px; color: #475569;">文本驱动目标检测，图文跨模态增强</td>
      <td style="padding: 12px;"><a href="#32-grounding-dino-%E5%BC%80%E9%9B%86%E6%96%87%E6%9C%AC%E9%A9%B1%E5%8A%A8%E6%A3%80%E6%B5%8B-idea-2023">阅读指南</a></td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">检测 + 分割</td>
      <td style="padding: 12px; color: #64748b;">Grounded-SAM</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">检测后分割，工程友好</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">位姿追踪</td>
      <td style="padding: 12px; color: #64748b;">FoundationPose</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">物体 6D 位姿估计</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">深度估计</td>
      <td style="padding: 12px; color: #64748b;">Depth Anything v1/v2</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">单目深度预测</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">点云表征</td>
      <td style="padding: 12px; color: #64748b;">Point Transformer v3</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">点云特征学习</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">生成</td>
      <td style="padding: 12px; color: #64748b;">Stable Diffusion</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">生成目标图像或中间表征</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px; font-weight: 600;">机器人 FM</td>
      <td style="padding: 12px; color: #64748b;">RDT-1B</td>
      <td style="padding: 12px;"><span style="background-color: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">Ongoing</span></td>
      <td style="padding: 12px; color: #94a3b8;">双臂操作基础模型</td>
      <td style="padding: 12px; color: #94a3b8;">-</td>
    </tr>
  </tbody>
</table>

---

## 1. CLIP (Contrastive Language-Image Pre-training) 演进

OpenAI 于 2021 年提出 CLIP，首次确立了以 **双塔对比学习（Dual-Encoder Contrastive Learning）** 进行大规模图文匹配的范式。

### 1.1 经典基准：OpenAI CLIP (2021)
* **核心架构**：图像编码器（ResNet/ViT）+ 文本编码器（Transformer）+ 投影映射空间（D维投影层 & L2归一化）+ 可学习温度参数 $\tau$。
* **损失函数**：对称 InfoNCE 损失。在一个 Batch $N$ 内，计算所有图像和文本间的余弦相似度并最大化正样本对概率。

### 1.2 OpenCLIP (LAION, 2022)
* **优化维度**：开源复现与超大规模缩放。基于 LAION-2B 等大规模开源数据集训练，证明了开源数据集及参数缩放（ViT-bigG, 2.5B参数）能达到甚至超越闭源模型的 Zero-shot 分类效果。

### 1.3 FLIP: 掩码图文对比学习 (Meta, 2022)
* **优化维度**：训练速度与算力效率。在 ViT 输入前随机遮蔽大比例（50%~75%）图像 patches，仅编码未遮蔽部分。
* **效果**：实现 2~3 倍的训练加速，且因掩码的强正则防过拟合效应，在相同算力预算下表现更优。

### 1.4 CLIPA: 动态分辨率位置插值 (2023)
* **优化维度**：动态多尺度预训练。在训练早期使用超低分辨率（如 $112 \times 112$），末期微调切换至高分辨率（如 $224 \times 224$），利用位置插值（Bilinear Interpolation）自动对齐位置编码。

### 1.5 SigLIP: From Softmax to Sigmoid Loss (Google, 2023)
* **优化维度**：分布式多卡通信效率。将对比学习 Softmax 归一化转化为 $N \times N$ 个**独立的二分类问题**，采用 Binary Cross Entropy 损失。
* **优势**：消除了分布式 All-Gather 通信瓶颈，通信开销由 $O(N^2)$ 降低到 $O(N)$，且在小 Batch 下更加稳定，适合处理数百万级别的超大规模 Batch。

#### PyTorch 从零代码实现 (SigLIP Forward Example)
```python
# 核心结构定义于 CLIP/siglip.py
from CLIP.siglip import SigLIP, SigLIPLoss
import torch

# 模拟前向输入 (Batch Size = 2)
model = SigLIP(vocab_size=32000, embed_dim=512)
loss_fn = SigLIPLoss()

images = torch.randn(2, 3, 224, 224)
text = torch.randint(0, 32000, (2, 64))
eot_indices = torch.tensor([10, 15]) # 结束 token 索引

image_embeds, text_embeds = model(images, text, eot_indices)
loss = loss_fn(image_embeds, text_embeds)
print(f"SigLIP Binary Cross Entropy Loss: {loss.item()}")
```

---

## 2. DINO 自监督学习与检测系列

### 2.1 DINO v1: 无监督自蒸馏机制 (Meta, 2021)
* **核心机制**：学生（Student）和教师（Teacher）双网络架构，教师网络权重由学生通过 EMA（指数移动平均）更新。
* **防坍塌策略**：采用**中心化 (Centering)** 和**锐化 (Sharpening)** 对教师端 Softmax 分布进行缩放，结合 Multi-crop（全局和局部剪裁对齐），无需负样本对比即可训练出强大的自监督语义分割特征。

### 2.2 DINOv2: 通用鲁棒特征表征 (Meta, 2023)
* **核心机制**：引入了 **iBOT 局部掩码图像建模 (MIM)**，在 patch 级别引入自监督掩码对齐。
* **正则化**：引入 **KoLeo 熵正则化 (Kozachenko-Leonenko Entropic Regularizer)**，最大化超球面特征点之间的平均距离，有效解决了特征维度坍塌，非常适合深度估计、语义分割等密集预测任务。

### 2.3 DINOv3: 格拉姆空间锚定约束 (Meta, 2025.08)
* **核心机制**：为了克服大模型（如 7B 参数）长周期自监督训练导致的**局部密集特征图退化**现象，引入了 **Gram Anchoring**。
* **数学约束**：通过约束学生网络的 Gram 矩阵相似度图谱与一个稳定的 Gram 教师一致：
  $$\mathcal{L}_{Gram} = \| G_{student} - G_{teacher} \|_F^2$$
  大幅减少特征噪点，使得卫星遥感森林冠高估计等下游预测更具连续性。

### 2.4 DINO-DETR: 高效收敛的 Transformer 检测器 (IDEA, 2023)
* **三大创新**：
  * **混合查询选择 (Mixed Query Selection)**：以 Encoder 强特征作为自适应 positional queries，保持 content queries 为空，提供强空间先验。
  * **对比去噪训练 (CDN)**：设置正负噪点框，避免检测框重叠，加速收敛。
  * **向前看两次 (Look Forward Twice)**：坐标梯度直接从后一层回传给前一层，加快检测坐标更新。

### 3.2 Grounding DINO: 开集文本驱动检测 (IDEA, 2023)
* **跨模态融合**：由文本引导的开集检测器。使用双向特征增强器 (BiAttention Enhancer) 将 Swin 图像特征与 BERT 文本特征深度融合。
* **分类输出**：跨模态解码器预测查询向量与文本分词 embedding 之间的相似度，从而实现用自然语言 Prompt 驱动零样本目标检测。

#### PyTorch 从零代码实现 (Grounding DINO Inference)
```python
# 核心结构定义于 DINO/grounding_dino.py
from DINO.grounding_dino import GroundingDINO
import torch

# 实例化模型 (30522 为 BERT vocab_size)
model = GroundingDINO(vocab_size=30522, num_queries=25, decoder_layers=6)

# 模拟图文前向输入
images = torch.randn(2, 3, 256, 256)
input_ids = torch.randint(0, 30522, (2, 15)) # 文本 Prompt tokens

outputs = model(images, input_ids)
print("Alignment Logits shape:", outputs["pred_logits"].shape) # [Batch, Queries, Tokens]
print("Bbox Coordinates shape:", outputs["pred_boxes"].shape)   # [Batch, Queries, 4]
```

---

## 3. 正在开发中模型 / Ongoing Models

以下模型正在火热集成中，敬请期待：

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 16px;">
  
  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">Segment Anything (SAM / SAM2)</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">支持点/框提示分割。SAM2 将分割能力拓宽至视频级跨帧时序关联分割。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">SAM3 & SAM3D</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">支持图像/视频的持续分割，并将其拓展至 3D 资产、场景及人体重建。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">Grounded-SAM</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">联合 Grounding-DINO 的检测能力与 SAM 的高精分割能力，实现文本驱动检测后分割的工程化落地。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">FoundationPose</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">针对未知物体的通用 6D 位姿估计与追踪，是机器人抓取和增强现实（AR）的底座模型。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">Depth Anything v1/v2</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">强大的单目零样本深度预测基础模型，为三维感知提供像素级精准的深度预测图。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">Point Transformer v3</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">超高性能的 3D 点云表征骨干网络，通过稀疏注意力机制对大规模点云场景实施自监督表征学习。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">Stable Diffusion</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">基于潜在扩散的图像生成基础模型，除了能生成高质图像外，还能通过去噪过程提取强大的通用特征。</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Ongoing</span>
    <h4 style="margin: 8px 0 4px 0; font-size: 1.15rem; color: #1e293b;">RDT-1B 双臂机器人模型</h4>
    <p style="margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5;">专为双臂复杂操作设计的具身智能基础模型（Robotic Decision Transformer），支持多任务泛化和长距离行为规划。</p>
  </div>

</div>
