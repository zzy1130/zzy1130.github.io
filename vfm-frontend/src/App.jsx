import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

const modelsData = [
  {
    id: 'clip',
    category: '图文对齐',
    name: 'CLIP',
    status: 'Available',
    summary: '图像–文本共享语义空间',
    description: 'OpenAI 提出的双塔对比学习网络，首次确立了以对称 InfoNCE 损失进行大规模图文匹配的范式。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/CLIP/README.md',
    details: {
      introduction: 'OpenAI 于 2021 年提出 CLIP（Learning Transferable Visual Models From Natural Language Supervision），通过大规模互联网图文对（400M 对）进行对比学习，将视觉与文本表征对齐在同一个共享语义空间中，奠定了多模态表征对齐的基石。',
      submodels: [
        {
          name: 'Classic CLIP (OpenAI, 2021)',
          desc: '经典双塔基线。包含 Vision Encoder (ResNet/ViT) 与 Text Encoder (Transformer)，使用对称 InfoNCE 交叉熵损失，依赖超大 Batch Size 维持负样本多样性。',
          code: `# CLIP Baseline in PyTorch\nimport torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass CLIPBaseline(nn.Module):\n    def __init__(self, vocab_size=49408, embed_dim=512):\n        super().__init__()\n        self.image_encoder = VisionTransformer(embed_dim=embed_dim)\n        self.text_encoder = TextTransformer(vocab_size=vocab_size, embed_dim=embed_dim)\n        self.temperature = nn.Parameter(torch.ones([]) * 2.659) # ln(1/0.07)\n\n    def forward(self, images, text):\n        v_feats = self.image_encoder(images)\n        t_feats = self.text_encoder(text)\n        v_feats = F.normalize(v_feats, p=2, dim=-1)\n        t_feats = F.normalize(t_feats, p=2, dim=-1)\n        return v_feats, t_feats`
        },
        {
          name: 'OpenCLIP (LAION, 2022)',
          desc: '开源大规模复现与缩放。基于开源的 LAION-2B 数据集进行训练，证明了开源的复现模型同样能在性能上与闭源模型并驾齐驱，并推出了高达 2.5B 参数的 ViT-bigG 超大模型。',
          code: `# OpenCLIP Scale-Up\n# 引入了更先进的优化技术，如 AdamW、混合精度训练与余弦学习率调度调度。\n# 验证了在 2B 规模图文对下的对比表征学习扩展极限。`
        },
        {
          name: 'FLIP (Meta, 2022)',
          desc: '掩码对比学习。在 ViT 编码前，随机遮蔽（Masking）大比例（如 50%~75%）图像 patches，极大减少了特征冗余计算，实现了 2~3 倍的训练加速。',
          code: `# FLIP Image Patch Masking\n# 训练时仅计算未被 mask 的 patches:\nclass FLIP(nn.Module):\n    def forward(self, x):\n        # x: [B, N, D]\n        keep_len = int(N * (1 - self.mask_ratio))\n        noise = torch.rand(B, N, device=x.device)\n        ids_keep = torch.argsort(noise, dim=1)[:, :keep_len]\n        x_masked = torch.gather(x, dim=1, index=ids_keep.unsqueeze(-1).expand(-1, -1, D))\n        return self.transformer(x_masked)`
        },
        {
          name: 'CLIPA (2023)',
          desc: '逆向分辨率训练与 Token Packing。前期使用低分辨率（如 112x112）高 Batch 训练以快速对齐语义，最后几个 Epoch 切换至 224x224 分辨率进行位置编码插值微调，极大地节约了学术界的计算预算。',
          code: `# CLIPA Bilinear Positional Interpolation\n# 动态插值位置编码：\nclass CLIPA(nn.Module):\n    def interpolate_pos_embed(self, pos_embed, new_size):\n        # pos_embed: [1, N_old, D]\n        # 通过双线性插值将一维序列位置编码缩放至 [new_h, new_w] 的网格中`
        },
        {
          name: 'EVA-CLIP (BAAI, 2023)',
          desc: '视觉自监督（MIM）强初始化对齐。不从头训练，而是使用经过掩码图像建模预训练的强视觉骨干进行初始化，引入 LayerScale 和 SwiGLU 稳定机制，解决了百亿参数级对比学习训练易崩溃的难题。',
          code: `# EVA-CLIP LayerScale & SwiGLU\n# 引入 LayerScale 稳定超大型 Transformer 训练：\nclass Block(nn.Module):\n    def __init__(self, dim, init_values=1e-5):\n        super().__init__()\n        self.gamma1 = nn.Parameter(init_values * torch.ones((dim)), requires_grad=True)\n        self.gamma2 = nn.Parameter(init_values * torch.ones((dim)), requires_grad=True)\n\n    def forward(self, x):\n        x = x + self.gamma1 * self.attn(self.norm1(x))\n        x = x + self.gamma2 * self.mlp(self.norm2(x))\n        return x`
        },
        {
          name: 'SigLIP (Google, 2023)',
          desc: '革命性的 Sigmoid BCE 损失。Google 提出的多模态对齐骨干，将对比学习 Softmax 归一化转化为 N×N 个独立的二分类问题，通信开销从 O(N^2) 降至 O(N)，完美支持了多卡超大规模 Batch 训练。',
          code: `# SigLIP Sigmoid Pairwise Loss\nclass SigLIPLoss(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.t = nn.Parameter(torch.ones([]) * 10.0)\n        self.b = nn.Parameter(torch.ones([]) * -10.0)\n\n    def forward(self, v_embeds, t_embeds):\n        logits = torch.matmul(v_embeds, t_embeds.t()) * self.t + self.b\n        labels = 2 * torch.eye(logits.size(0), device=logits.device) - 1\n        loss = -torch.nn.functional.logsigmoid(labels * logits).mean()\n        return loss`
        }
      ]
    }
  },
  {
    id: 'dino',
    category: '表征学习',
    name: 'DINO (v1/v2/v3)',
    status: 'Available',
    summary: '高层视觉特征，对 correspondence 很有帮助',
    description: 'Meta 提出的视觉自监督学习家族，从 v1 的自蒸馏机制发展到 v2 的 iBOT 掩码对齐与 KoLeo 正则，再到 v3 的 Gram 空间锚定约束，全面攻克了自监督表征与密集预测难题。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/DINO/README.md',
    details: {
      introduction: 'DINO（Self-distillation with no labels）是 Meta 提出的革命性自监督学习框架。通过 Teacher-Student 双塔架构和特殊的防崩溃设计，在没有人工标签的情况下，自发学习出高对比度、具备物体边界感以及极强几何对应关系的密集视觉特征。同时，IDEA-Research 团队在 DINO 目标检测器范式上进行了延伸，孵化出 DINO-DETR 与 Grounding DINO 开集文本引导定位器。',
      submodels: [
        {
          name: 'DINO v1 (Meta, 2021)',
          desc: '教师-学生自蒸馏机制。学生网络和教师网络接收不同 crop 图像（包含 Global/Local crop），教师网络只计算 Global crop，通过中心化（Centering）和锐化（Sharpening）更新累积均值，防止特征折叠。',
          code: `# DINO v1 Centering and Sharpening Loss\nclass DINOLoss(nn.Module):\n    def forward(self, student_output, teacher_output):\n        teacher_centered = teacher_output - self.center\n        teacher_probs = F.softmax(teacher_centered / self.teacher_temp, dim=-1)\n        student_probs = F.log_softmax(student_output / self.student_temp, dim=-1)\n        loss = -torch.sum(teacher_probs * student_probs, dim=-1).mean()\n        self.update_center(teacher_output)\n        return loss`
        },
        {
          name: 'DINOv2 (Meta, 2023)',
          desc: 'iBOT MIM 与 KoLeo 正则。引入了 patch 级别的局部掩码图像建模（MIM）损失，并在特征空间引入 KoLeo 正则化，促使特征在超球面上均匀分布，极大地提升了密集预测（密集深度估计、语义分割）的泛化能力。',
          code: `# DINOv2 KoLeo Entropic Regularizer\nclass KoLeoLoss(nn.Module):\n    def forward(self, x):\n        x = F.normalize(x, p=2, dim=-1)\n        dists = torch.cdist(x, x)\n        dists = dists + torch.eye(x.size(0), device=x.device) * 1e9\n        min_dists = dists.min(dim=-1).values\n        loss = -torch.log(min_dists + 1e-8).mean()\n        return loss`
        },
        {
          name: 'DINOv3 (Meta, 2025.08)',
          desc: '格拉姆空间锚定约束。为了解决大模型长周期预训练时出现的局部密集特征图噪点化、表征退化现象，引入了 Gram Anchoring，通过强制约束学生网络的 Gram 矩阵与 Gram 教师的一致，锁定了局部空间拓扑。',
          code: `# DINOv3 Gram Anchoring Loss\nclass GramAnchoringLoss(nn.Module):\n    def forward(self, student_raw, teacher_raw):\n        s = F.normalize(student_raw, p=2, dim=-1)\n        t = F.normalize(teacher_raw, p=2, dim=-1)\n        G_s = torch.bmm(s, s.transpose(1, 2))\n        G_t = torch.bmm(t, t.transpose(1, 2))\n        loss = F.mse_loss(G_s, G_t)\n        return loss`
        },
        {
          name: 'DINO-DETR (IDEA, 2023)',
          desc: 'Transformer 目标检测骨干。引入混合查询选择（Mixed Query Selection）、对比去噪训练（CDN）正负噪点框加速收敛，以及向前看两次（Look Forward Twice）迭代坐标梯度修正。',
          code: `# DINO-DETR CDN & Query Selection\n# 核心细节见 dino_detr.py\n# 使用混合查询选择提升 Anchor 质量，Look Forward Twice 增强梯度流回传。`
        },
        {
          name: 'Grounding DINO (IDEA, 2023)',
          desc: '开集文本引导目标检测。引入双向特征增强器（BiAttention Enhancer），将图像特征与 BERT 提取的文本提示特征进行深度跨模态注意力融合，实现用自然语言 Prompt 零样本定位任意物体。',
          code: `# Grounding DINO Cross-Modality Interaction\n# 双向特征对齐计算：\n# img_feats, txt_feats = self.bi_attention(img_feats, txt_feats)`
        }
      ]
    }
  },
  {
    id: 'sam',
    category: '分割',
    name: 'SAM 系列 (v1 / v2 / v3 & 变体)',
    status: 'Available',
    summary: '提示分割、时序跟踪与高精度变体全家桶',
    description: 'Meta AI 提出的可提示分割大模型家族。从 SAM 1 奠定三塔结构，到 SAM 2 引入 Memory Bank 实现视频时序追踪，再到 SAM 3 的可提示概念分割（PCS），以及 HQ-SAM、MobileSAM 的精度与速度方向变体，生态完整，工程友好。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/SAM/README.md',
    details: {
      introduction: 'SAM（Segment Anything Model）是 Meta AI 于 2023 年发布的通用交互式分割基础模型，确立了「图像编码器 + 提示编码器 + 掩码解码器」三塔结构范式，并配合 SA-1B（11 亿掩码）数据集实现零样本泛化。本项目对 SAM 生态中的 7 个核心架构进行了纯 PyTorch 从零实现：SAM 1 基线、SAM 2 时序记忆追踪、SAM 3 可提示概念分割、SAM 3D 三维重建、HQ-SAM 高精度边界修正、MobileSAM 轻量化加速、Grounded-SAM 开集文本分割流水线。',
      submodels: [
        {
          name: 'SAM 1 (Meta, 2023)',
          desc: '三塔结构提示分割基线。重型 ViT-H 图像编码器提取特征，轻量提示编码器处理点/框/掩码提示，双向交叉注意力掩码解码器同时预测 3 个粒度的掩码（Whole / Part / Subpart）并评估 IoU 分数，用 Focal Loss + Dice Loss 联合训练。',
          code: `# SAM 1 核心前向调用
from SAM.sam_v1 import SAM1
import torch

model = SAM1(in_channels=3, embed_dim=256)

images = torch.randn(1, 3, 256, 256)
points = torch.tensor([[[0.3, 0.4], [0.7, 0.8]]])  # [B, N_pts, 2]
labels = torch.tensor([[1, 0]])                     # 1=前景, 0=背景
boxes  = torch.tensor([[0.2, 0.2, 0.8, 0.8]])       # [B, 4] xyxy

masks, iou_scores = model(images, points=points, labels=labels, boxes=boxes)
# masks: [1, 3, 64, 64]  三个粒度掩码
# iou_scores: [1, 3]     对应 IoU 置信分数`
        },
        {
          name: 'SAM 2 (Meta, 2024)',
          desc: '视频流式记忆追踪。引入 Memory Bank（FIFO 队列）存储历史帧特征与掩码，Memory Attention Block 让当前帧以 Cross-Attention 检索历史信息实现跨帧传播。用户可在任意帧添加 Prompt 作为新记忆节点，向前后扩散修正。',
          code: `# SAM 2 视频流式追踪调用
from SAM.sam_v2 import SAM2
import torch

model = SAM2(in_channels=3, embed_dim=256)
model.reset_video_memory()   # 清空记忆库

# 第 0 帧：用户交互
img0 = torch.randn(1, 3, 256, 256)
pts0 = torch.tensor([[[0.5, 0.5]]])
lbls0 = torch.tensor([[1]])
masks0, iou0 = model(img0, points=pts0, labels=lbls0, is_video_frame=True)

# 第 1 帧：自动时序追踪（无 Prompt）
img1 = torch.randn(1, 3, 256, 256)
masks1, iou1 = model(img1, is_video_frame=True)
print("Tracked:", masks1.shape)  # [1, 3, 64, 64]`
        },
        {
          name: 'SAM 3 (2025)',
          desc: '可提示概念分割（PCS）与存在性检测。引入多模态 Concept Encoder 将文本名词或视觉示例 Crop 编码为统一 prompt token，并新增独立 Presence Head 输出目标存在概率，防止遮挡/出界时的追踪漂移。',
          code: `# SAM 3 概念提示分割调用
from SAM.sam_v3 import SAM3
import torch

model = SAM3(in_channels=3, embed_dim=256)

images = torch.randn(1, 3, 256, 256)
text_ids = torch.randint(0, 30522, (1, 5))    # 文本提示 token
exemplars = torch.randn(1, 3, 64, 64)         # 视觉示例 Crop

masks, scores, presence_logits = model(
    images, text_input_ids=text_ids, exemplar_crops=exemplars
)
print("PCS masks:", masks.shape)              # [1, 3, 64, 64]
print("Presence logit:", presence_logits)     # [1, 1]`
        },
        {
          name: 'SAM 3D (2023–2025)',
          desc: '2D 掩码三维反投影与生成式网格重建。Camera Lifting Module 利用相机内参 K 与外参 [R|T]，将 2D 分割掩码与深度图反投影到三维点云。生成式网格头基于全局图像特征解码出三维边界框布局与网格顶点偏移量，实现单视角零样本三维重建。',
          code: `# SAM 3D 反投影与三维网格重建
from SAM.sam_3d import SAM3D
import torch

model = SAM3D(embed_dim=256, num_vertices=100, num_faces=200)

img_feats   = torch.randn(1, 256, 16, 16)
mask_logits = torch.randn(1, 1, 32, 32)
depth_map   = torch.randn(1, 1, 32, 32).abs() + 0.1
intrinsics  = torch.eye(3).unsqueeze(0)                               # K [1,3,3]
extrinsics  = torch.cat([torch.eye(3), torch.zeros(3,1)], dim=1).unsqueeze(0)  # [R|T] [1,3,4]

outputs = model(img_feats, mask_logits=mask_logits,
                depth_map=depth_map, intrinsics=intrinsics, extrinsics=extrinsics)
print("Mesh vertices:", outputs["vertices"].shape)     # [1, 100, 3]
print("3D Point Cloud:", outputs["point_cloud"].shape) # [1, 1024, 3]`
        },
        {
          name: 'HQ-SAM (ICCV 2023)',
          desc: '高精度边界修正。完全冻结 SAM 1 预训练权重，仅加入可学习 HQ-Token。该 Token 融合 ViT 浅层的高清几何边界特征（Low-level early features）与深层语义特征，专门修复发丝、网格等极细微物体的分割质量。',
          code: `# HQ-SAM 高精度掩码生成
from SAM.hq_sam import HQSAM
import torch

model = HQSAM(in_channels=3, embed_dim=256)

images = torch.randn(1, 3, 256, 256)
points = torch.tensor([[[0.5, 0.5]]])
labels = torch.tensor([[1]])

masks, iou_scores = model(images, points=points, labels=labels)
# masks: [1, 4, 64, 64]  — 前 3 个同 SAM 1, 第 4 个是 HQ 高精掩码
print("HQ mask:", masks[:, 3, :, :].shape)  # [1, 64, 64]`
        },
        {
          name: 'MobileSAM (2023)',
          desc: '解耦知识蒸馏轻量化。保持提示编码器和掩码解码器完全冻结，仅用 5M 参数的 TinyViT 替换原 ViT-H 图像编码器，蒸馏对齐其特征空间，在移动端实现毫秒级实时分割。',
          code: `# MobileSAM 边缘端快速分割
from SAM.mobile_sam import MobileSAM
import torch

model = MobileSAM(in_channels=3, embed_dim=256)

images = torch.randn(1, 3, 256, 256)
boxes  = torch.tensor([[0.1, 0.1, 0.9, 0.9]])

masks, iou_scores = model(images, boxes=boxes)
print("MobileSAM masks:", masks.shape)  # [1, 3, 64, 64]`
        },
        {
          name: 'Grounded-SAM',
          desc: '开集文本引导分割流水线。Grounding DINO 接收自然语言 Prompt 检测目标并输出边界框；框坐标自动从 [cx,cy,w,h] 转换为 [x1,y1,x2,y2] 作为 SAM 的 Box Prompt，生成高精度开集语义分割掩码，全流程无需任何类别预定义。',
          code: `# Grounded-SAM 文本驱动开集分割
from SAM.grounded_sam import GroundedSAM
import torch

model = GroundedSAM(vocab_size=30522, num_queries=15, embed_dim=256)

images    = torch.randn(1, 3, 256, 256)
input_ids = torch.randint(0, 30522, (1, 10))  # 文本 prompt tokenized

masks_batch, boxes_batch = model(images, input_ids, confidence_threshold=0.1)
masks = masks_batch[0]  # 首张图检测分割结果
if masks is not None:
    print(f"Detected {boxes_batch[0].shape[0]} targets")
    print("Seg masks shape:", masks.shape)  # [N, 1, 64, 64]`
        }
      ]
    }
  },
  {
    id: 'foundationpose',
    category: '位姿追踪',
    name: 'FoundationPose',
    status: 'Available',
    summary: '零样本未知物体 6D 位姿估计与追踪',
    description: '零样本泛化的 6D 物体姿态估计与跟踪基础模型。从传统的特征渲染对比，到 Any6D 的单视角无 CAD 尺度估计，再到 FreeZeV2 免训练点云匹配与 OPFormer 的端到端 Transformer 几何重构。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/FoundationPose/README.md',
    details: {
      introduction: 'FoundationPose（CVPR 2024 Highlight）奠定了统一的未知物体姿态估计与跟踪框架。本项目对其及后续 Any6D、FreeZeV2 和 OPFormer 进行了纯 PyTorch 复现，实现了无需微调即可泛化到未知物体的三维位姿估计。',
      submodels: [
        {
          name: 'FoundationPose (CVPR 2024)',
          desc: '姿态估计与追踪基准。采用共享特征提取器融合 RGB-D 裁剪图与渲染姿态模板，使用 Pose RefineNet 连续回归 6D 相对更新量 (ΔR, Δt)，最后通过 Pose Selection Transformer 利用自注意力打分机制筛选最优假设。',
          code: `# FoundationPose 姿态细化与选择
import torch
from FoundationPose.foundation_pose import FoundationPose

model = FoundationPose(feature_dim=128)

# 1个 Batch, 5个候选姿态渲染图, 4通道(RGB-D)
query_img = torch.randn(1, 4, 112, 112)
candidate_renders = torch.randn(1, 5, 4, 112, 112)

best_idx, (refined_rot, refined_trans), scores = model(query_img, candidate_renders, refine_iters=3)
print("Best candidate index:", best_idx.item())
print("Refined Rotations:", refined_rot.shape)  # [1, 5, 3, 3]`
        },
        {
          name: 'Any6D (CVPR 2025)',
          desc: '无 CAD 模型的 6D 姿态与绝对尺度估计。利用 InstantMesh 单视角三维重建恢复 normalized 网格，通过 Coarse Scale Aligner 计算绝对尺度因子 s 以及初始平移，最终级联精细化头估计物理世界的绝对尺寸姿态。',
          code: `# Any6D 6D位姿与绝对尺度预测
from FoundationPose.any6d import Any6D
import torch

model = Any6D(feature_dim=128)

anchor_rgb = torch.randn(1, 3, 112, 112)
anchor_depth = torch.randn(1, 1, 112, 112)
anchor_mask = (torch.randn(1, 1, 112, 112) > 0).float()

query_img = torch.randn(1, 4, 112, 112)
candidate_renders = torch.randn(1, 5, 4, 112, 112)

best_idx, (rot, trans), scores, scale = model(
    anchor_rgb, anchor_depth, anchor_mask,
    query_img, candidate_renders, refine_iters=2
)
print("Metric scale s:", scale.item())`
        },
        {
          name: 'FreeZeV2 (BOP 2024 Winner)',
          desc: '免训练点云匹配位姿估计器。彻底冻结 DINOv2 作为视觉编码器提取超强局部特征，将像素根据深度反投影到 3D 空间，双向特征检索后利用 RANSAC 鲁棒采样和 Kabsch SVD 算法闭式解出最优位姿。',
          code: `# FreeZeV2 免训练位姿估计
from FoundationPose.freeze_v2 import FreeZeV2
import torch

model = FreeZeV2(feature_dim=384, ransac_iters=30)

query_rgb = torch.randn(1, 3, 112, 112)
query_depth = torch.randn(1, 1, 112, 112)
query_intrinsics = torch.tensor([[[100.0, 0.0, 56.0], [0.0, 100.0, 56.0], [0.0, 0.0, 1.0]]])

# 20个 3D 模板点及其 DINOv2 描述子
template_descriptors = torch.randn(1, 20, 384)
template_pts_3d = torch.randn(1, 20, 3)

R, t, conf = model(query_rgb, query_depth, query_intrinsics, template_descriptors, template_pts_3d)
print("Estimated R:", R.shape)  # [1, 3, 3]
print("Confidence:", conf.item())`
        },
        {
          name: 'OPFormer (CVPR 2026)',
          desc: '端到端 Transformer 姿态估计器。使用 Multi-Template 融合跨视图模板特征，引入 NOCS 归一化物体坐标空间几何先验特征，并在 Correspondences Decoder 中以 Cross-Attention 稠密计算 2D 像素到 3D 物体点云的对应关系。',
          code: `# OPFormer 端到端 Transformer 位姿回归
from FoundationPose.opformer import OPFormer
import torch

model = OPFormer(feature_dim=128, num_templates=5)

query_rgb = torch.randn(1, 3, 112, 112)
query_depth = torch.randn(1, 1, 112, 112)
query_intrinsics = torch.tensor([[[100.0, 0.0, 56.0], [0.0, 100.0, 56.0], [0.0, 0.0, 1.0]]])
templates = torch.randn(1, 5, 3, 112, 112)

R, t, nocs_map, pred_pts_3d = model(query_rgb, query_depth, query_intrinsics, templates)
print("NOCS Map Shape:", nocs_map.shape)  # [1, 3, 56, 56]`
        }
      ]
    }
  },
  {
    id: 'depth-anything',
    category: '深度估计',
    name: 'Depth Anything v1 / v2 / Video / Prompt',
    status: 'Available',
    summary: '单目相对与绝对深度估计全系大模型',
    description: '单目深度估计（MDE）领域的里程碑系列。从 V1 大规模半监督蒸馏，到 V2 依靠合成完美 Teacher 解决细节缺陷，再到 Video 视频时序一致性架构，以及利用稀疏 LiDAR 锚定的高保真度量深度头。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/Depth-Anything/README.md',
    details: {
      introduction: 'Depth Anything 家族聚焦于相对深度和绝对度量深度。本项目实现了 V1 相对蒸馏、V2 合成数据微调、Video 的 ConvLSTM 时序一致性流动，以及 Prompt Depth Anything 接受稀疏 LiDAR 注入生成 4K 度量深度的全部架构。',
      submodels: [
        {
          name: 'Depth Anything V1 (CVPR 2024)',
          desc: '使用 DINOv2 ViT 编码器与 DPT 解码器，输出仿射不变的相对深度（视差），设计 L_ssi + L_gm 仿射不变损失，并通过对 62M 无标注互联网图片进行伪标签蒸馏来解锁极强泛化基础能力。',
          code: `# Depth Anything V1 相对深度估计
from DepthAnything.depth_anything_v1 import DepthAnythingV1
import torch

model = DepthAnythingV1(scale='S')
model.eval()

image = torch.randn(1, 3, 518, 518)
with torch.no_grad():
    depth = model(image)
print("Relative depth:", depth.shape)  # [1, 1, 518, 518]`
        },
        {
          name: 'Depth Anything V2 (NeurIPS 2024)',
          desc: '针对 V1 的噪声限制，在三阶段框架下，使用 595K 高质量合成完美 Teacher 生成超清晰伪标签，极大地改善了轻薄结构与透明物体深度，并提供相机 FoV 条件化的绝对度量深度估计头。',
          code: `# Depth Anything V2 度量深度估计
from DepthAnything.depth_anything_v2 import DepthAnythingV2
import torch

model = DepthAnythingV2(scale='S', metric=True, max_depth=10.0)
model.eval()

image = torch.randn(1, 3, 518, 518)
fov_rad = torch.tensor([1.22])   # 70° 水平视场角 (弧度)
with torch.no_grad():
    depth_metric = model(image, fov_rad=fov_rad)
print("Metric depth meters range:", depth_metric.min().item(), "~", depth_metric.max().item())`
        },
        {
          name: 'Video Depth Anything (CVPR 2025 Highlight)',
          desc: '视频深度一致性架构。在 ViT 图像编码器后方交织引入 ConvLSTM，在帧间实现 2D 空间保留的时序信息传递，支持流式推理（Streaming Mode，逐帧恒定显存），从根本上消除了视频帧间的深度抖动。',
          code: `# Video Depth Anything 时序流式推理
from DepthAnything.video_depth_anything import VideoDepthAnything
import torch

model = VideoDepthAnything(scale='S')
model.reset_temporal_state()

for i in range(3):
    frame = torch.randn(1, 3, 256, 256)
    with torch.no_grad():
        depth = model.forward_streaming(frame)
    print(f"Frame {i} depth:", depth.shape)  # [1, 1, 256, 256]`
        },
        {
          name: 'Prompt Depth Anything (CVPR 2025)',
          desc: '稀疏 LiDAR 引导 of 4K 度量深度预测。使用低成本稀疏点阵（如 iPhone ARKit Lidar 32x24）作为度量锚提示，并在 DPT 解码器的 Fusion 块中加性融合，输出超高分辨率绝对深度，终结单视角尺度模糊。',
          code: `# Prompt Depth Anything 提示深度估计
from DepthAnything.prompt_depth_anything import PromptDepthAnything
import torch

model = PromptDepthAnything(scale='S', max_depth=10.0)
model.eval()

rgb = torch.randn(1, 3, 512, 512)
lidar = torch.rand(1, 1, 24, 32) * 8.0  # 极稀疏 LiDAR 模拟
lidar_mask = torch.rand(1, 1, 24, 32) > 0.9
lidar = lidar * lidar_mask.float()

with torch.no_grad():
    metric_depth = model(rgb, lidar)
print("4K Metric Depth:", metric_depth.shape)  # [1, 1, 512, 512]`
        }
      ]
    }
  },
  {
    id: 'point-transformer',
    category: '点云表征',
    name: 'Point Transformer v1 / v2 / v3 & Point-MAE',
    status: 'Available',
    summary: '点云局部注意力与 Morton 序列化表征骨干',
    description: '3D 点云处理核心骨干网络。从 PTv1 的 KNN 向量自注意力，到 PTv2 的分组注意力与体素下采样优化，再到 PTv3 Morton 曲线序列化与规则 1D 窗口让 FlashAttention 进入点云，以及自监督 Patch 掩码重建。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/PointTransformer/README.md',
    details: {
      introduction: 'Point Transformer 系列和 Point-MAE 为 3D 表征核心网络。本仓库提供了包括 PTv1 局部向量自注意力、PTv2 分组和体素划分、PTv3 空间 Morton 曲线 Z-order 排序及 Point-MAE 遮蔽 Chamfer 重建的完整实现。',
      submodels: [
        {
          name: 'Point Transformer V1 (ICCV 2021)',
          desc: '将自注意力机制应用到点云局部 KNN 邻域中，设计基于三维相对坐标变换的向量位置编码 PE。采用 Transition Down (KNN max pooling) 和 Transition Up (3-NN 插值) 的 U-Net 结构。',
          code: `# Point Transformer V1 KNN 向量自注意力
from PointTransformer.point_transformer_v1 import PointTransformerV1
import torch

model = PointTransformerV1(in_channels=6, num_classes=10, k=16)
model.eval()

xyz = torch.randn(2, 128, 3)
features = torch.randn(2, 128, 6)

logits = model(xyz, features)
print("Logits shape:", logits.shape)  # [2, 128, 10]`
        },
        {
          name: 'Point Transformer V2 (NeurIPS 2022)',
          desc: '为减小开销，提出分组向量注意力 (Grouped Vector Attention)，各组内共享向量注意力权重；引入 PE 乘数因子动态调整；并采用体素网格划分下采样 (Partition-Based Pooling) 替代昂贵的最远点采样 FPS。',
          code: `# Point Transformer V2 分组自注意力
from PointTransformer.point_transformer_v2 import PointTransformerV2
import torch

model = PointTransformerV2(in_channels=6, num_classes=10, groups=4, k=16)
model.eval()

xyz = torch.randn(2, 128, 3)
features = torch.randn(2, 128, 6)

logits = model(xyz, features)
print("Classified logits:", logits.shape)  # [2, 10]`
        },
        {
          name: 'Point Transformer V3 (CVPR 2024)',
          desc: '颠覆性的点云Morton Z曲线序列化方法。通过位交织排序将 3D 点云压缩为 1D 规则序列，在 1D Patch 内计算 Dense 注意力，可以直接调用 FlashAttention 内核，使运行速度和参数量级实现了跨越式提升。',
          code: `# Point Transformer V3 Morton序列化
from PointTransformer.point_transformer_v3 import PointTransformerV3
import torch

model = PointTransformerV3(in_channels=6, num_classes=10, channels=64, patch_size=32, num_heads=4)
model.eval()

xyz = torch.randn(2, 128, 3)
features = torch.randn(2, 128, 6)

logits = model(xyz, features)
print("Morton sorted logits:", logits.shape)  # [2, 10]`
        },
        {
          name: 'Point-MAE (ECCV 2022)',
          desc: '3D 点云的 Masked Autoencoder 自监督学习。使用 FPS + KNN 构建点块，随机 Mask 屏蔽 60%-80% 块，利用浅层 Transformer Encoder 编码可见块，由 Decoder 将 masked token 重建，并计算两点集 Chamfer 距离损失。',
          code: `# Point-MAE 点云自监督遮蔽重建
from PointTransformer.point_mae import PointMAE
import torch

model = PointMAE(embed_dim=128, depth_enc=3, depth_dec=1, mask_ratio=0.6, k=16)
model.eval()

xyz = torch.randn(2, 256, 3)
reconstructed, gt, masked_idx = model(xyz, target_num_patches=64)

loss = model.compute_loss(reconstructed, gt)
print("Chamfer Loss:", loss.item())`
        }
      ]
    }
  },
  {
    id: 'stable-diffusion',
    category: '生成',
    name: 'Stable Diffusion & DiT & 机器人 Policy',
    status: 'Available',
    summary: '从隐空间图像生成、DiT 到机器人动作扩散策略与流匹配决策',
    description: '生成式大模型全景。涵盖基于 U-Net 交叉注意力的 Stable Diffusion (LDM)，基于 AdaLN 参数调制的 DiT，支持 3D VAE 与时空因子 attention 的 Video DiT 物理世界模拟，以及机器人长视界 Diffusion Policy 与 Straight CFM 极速决策流。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/StableDiffusion/README.md',
    details: {
      introduction: '本目录实现了生成式基座与具身决策。包括隐空间 VAE 与去噪 U-Net，基于自适应层归一化（AdaLN）调制的 DiT 骨干网，时空 Video DiT，以及控制规控中用于避障多模态轨迹生成的 Diffusion Policy 与 5步积分快速流匹配 Flow Matching 轨迹规划器。',
      submodels: [
        {
          name: 'Stable Diffusion / LDM',
          desc: '隐空间扩散模型。包含下采样 8x 隐空间压缩的 VAE Encoder/Decoder 减小细节计算，使用含有 Cross-Attention 层的 U-Net 进行文本语义注入，并提供 DDPM/DDIM 确定性 ODE 积分加速采样调度器。',
          code: `# Stable Diffusion VAE 编解码与去噪 U-Net
from StableDiffusion.stable_diffusion import VAE, DenoisingUNet, DDPMScheduler
import torch

vae = VAE(in_channels=3, latent_dim=4)
unet = DenoisingUNet(in_channels=4, model_channels=64, out_channels=4)
scheduler = DDPMScheduler(num_train_timesteps=1000)

img = torch.randn(1, 3, 256, 256)
latent = vae.encode(img)  # [1, 4, 32, 32]
noise = torch.randn_like(latent)
t = torch.randint(0, 1000, (1,))

noisy_latent = scheduler.add_noise(latent, noise, t)
pred_noise = unet(noisy_latent, t)
print("Pred noise shape:", pred_noise.shape)  # [1, 4, 32, 32]`
        },
        {
          name: 'DiT (Diffusion Transformer)',
          desc: '以 Transformer 替代传统去噪 U-Net。隐变量切分为 patches，采用 AdaLN (自适应层归一化) 注入时间和类别条件嵌入，对 LN 后的特征在通道上计算动态缩放与偏移，保证条件注入强度可调且极快。',
          code: `# DiT AdaLN 条件调制
from StableDiffusion.dit import DiffusionTransformer
import torch

model = DiffusionTransformer(input_size=32, patch_size=2, in_channels=4, hidden_size=128, depth=4, num_heads=4)
model.eval()

latents = torch.randn(1, 4, 32, 32)
t = torch.tensor([500])
y = torch.tensor([1])  # Class label

out = model(latents, t, y)
print("DiT Output shape:", out.shape)  # [1, 4, 32, 32]`
        },
        {
          name: 'Video DiT (时空物理世界模型)',
          desc: 'Sora 核心机制。时空因子化将视频 3D 张量在空间/时间轴交织处理。输入 frame sequence (B, T, C, H, W)，空间层提取 2D 特征，时间注意力层重塑为 (B·H·W, T, C) 进行帧间交叉检索，学习物理世界运动方程。',
          code: `# Video DiT 时空混合自注意力
from StableDiffusion.video_dit import VideoDiT
import torch

model = VideoDiT(input_size=32, patch_size=2, in_channels=4, hidden_size=128, depth=4, num_heads=4)
model.eval()

video_latents = torch.randn(1, 8, 4, 32, 32)  # [B, T=8, C, H, W]
t = torch.tensor([100])
text_cond = torch.randn(1, 10, 128)

out = model(video_latents, t, text_cond)
print("Video output:", out.shape)  # [1, 8, 4, 32, 32]`
        },
        {
          name: 'Diffusion Policy',
          desc: '机器人动作轨迹生成。将视觉和本体感受拼接作为 Conditioning，去噪解算 1D 时间轴上的动作序列。相比确定性行为克隆，动作扩散利用其连续建模能力完美解决了示教数据中的多模态动作决策瓶颈。',
          code: `# 机器人动作轨迹生成 (Diffusion Policy)
from StableDiffusion.diffusion_policy import DiffusionPolicy
import torch

model = DiffusionPolicy(action_dim=2, obs_dim=64, pred_horizon=16)
model.eval()

obs_cond = torch.randn(1, 64)
noisy_actions = torch.randn(1, 16, 2)  # [B, Tp, action_dim]
t = torch.tensor([10])

pred_noise = model(noisy_actions, t, obs_cond)
print("Pred action noise:", pred_noise.shape)  # [1, 16, 2]`
        },
        {
          name: 'Flow Matching Policy',
          desc: '流匹配动作规划。使用 Straight CFM（条件流匹配）在线性插值下构建直线的动作演化路径，网络直接预测瞬时速度场 v_theta。推理时只需 5 步 Euler 积分即可快速生成高保真轨迹，降噪延迟极低。',
          code: `# 机器人流匹配动作规划 (Straight CFM)
from StableDiffusion.flow_matching_policy import FlowMatchingPolicy
import torch

model = FlowMatchingPolicy(action_dim=2, obs_dim=64, pred_horizon=16)
model.eval()

obs_cond = torch.randn(1, 64)
x_t = torch.randn(1, 16, 2)
t = torch.tensor([0.5])

# 预测粒子在当前时刻的直线运动速度
velocity = model(x_t, t, obs_cond)
print("Velocity field vector:", velocity.shape)  # [1, 16, 2]`
        }
      ]
    }
  },
  {
    id: 'rdt-1b',
    category: '机器人 FM',
    name: 'RDT-1B (Robotics Diffusion Transformer)',
    status: 'Available',
    summary: '十亿参数多模态具身动作决策大模型',
    description: '清华大学提出的机器人动作大模型骨干。在 128 维物理可解释的统一动作空间下，拼接 SigLIP 图像特征、T5-XXL 文本指令及当前关节 Proprioception 状态，基于大型 DiT 反向预测高精双臂协同控制。',
    githubReadme: 'https://github.com/zzy1130/Vision-Foundation-Model/blob/main/StableDiffusion/README.md',
    details: {
      introduction: 'RDT-1B 解决了异构机器人结构下的动作训练难题。通过对齐物理一致的 128 维动作空间，将相机多视角（胸部相机 + 左右手腕相机）提取 of 1152 维视觉 token 和 4096 维语言口令交叉融合到大模型特征中，双臂决策能力强劲。',
      submodels: [
        {
          name: 'RDT-1B Bimanual Controller',
          desc: '异构机器人动作大模型。以 MLP 统一映射各维度，使用注意力掩码 Action Mask 消除冗余，在多层 DiT Block 堆叠的主序列上，交替进行多视角相机跨注意与口令语义注入，推理反向预测动作轨迹。',
          code: `# RDT-1B 统一动作决策
from StableDiffusion.rdt import RDTRunner
import torch

rdt_runner = RDTRunner(
    action_dim=128, pred_horizon=64,
    lang_token_dim=4096, img_token_dim=1152, state_token_dim=128
)

lang_cond = torch.randn(1, 32, 4096)  # T5-XXL tokens
img_cond = torch.randn(1, 196, 1152)  # SigLIP tokens
state_traj = torch.randn(1, 1, 128)   # Proprioception state

# 计算训练 diffusion loss
actions_gt = torch.randn(1, 64, 128)
t = torch.tensor([[45]])
loss = rdt_runner(actions_gt, t, lang_cond, img_cond, state_traj)
print("Bimanual loss:", loss.item())

# 推理去噪动作序列 (64步 Tp, 128维动作)
pred_actions = rdt_runner.predict_action(lang_cond, img_cond, state_traj, num_inference_steps=10)
print("Predicted actions traj:", pred_actions.shape)  # [1, 64, 128]`
        }
      ]
    }
  }
];

const categories = ['All', '图文对齐', '表征学习', '分割', '分割追踪', '3D 重建', '开放词表检测', '检测 + 分割', '位姿追踪', '深度估计', '点云表征', '生成', '机器人 FM'];


const GITHUB_SVG = <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>;

// ──────────────────────────────────────────────
// Extracted: ModelCard component (React.memo for perf)
// ──────────────────────────────────────────────
const ModelCard = React.memo(function ModelCard({ model, onOpen }) {
  const handleClick = useCallback(() => {
    onOpen(model);
  }, [model, onOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(model);
    }
  }, [model, onOpen]);

  return (
    <article className="model-card" role="listitem" aria-label={`${model.name} — ${model.category}`}>
      <div className="model-card-header">
        <span className="card-category">{model.category}</span>
        <span className={`status-badge ${model.status.toLowerCase()}`} aria-label={`Status: ${model.status}`}>
          {model.status}
        </span>
      </div>
      <h3 className="model-card-title">{model.name}</h3>
      <p className="model-card-summary">{model.summary}</p>
      <p className="model-card-desc">{model.description}</p>
      <div className="model-card-footer">
        {model.status === 'Available' ? (
          <button
            className="explore-btn"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-haspopup="dialog"
          >
            阅读技术指南 →
          </button>
        ) : (
          <span className="ongoing-tag" aria-label="Coming soon">开发进行中 (Ongoing)</span>
        )}
      </div>
    </article>
  );
});

// ──────────────────────────────────────────────
// Extracted: ModalDetail component with focus management
// ──────────────────────────────────────────────
const ModalDetail = React.memo(function ModalDetail({ model, onClose }) {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const closeRef = useRef(null);
  const modalRef = useRef(null);

  // Focus the close button when modal opens (focus management from skill)
  useEffect(() => {
    closeRef.current?.focus();
    // Re-set sub tab when model changes
    setActiveSubTab(0);
  }, [model]);

  // Escape key to close (accessibility pattern from skill)
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleTabKeyDown = useCallback((e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveSubTab(idx);
    }
    if (e.key === 'ArrowRight') {
      setActiveSubTab(i => Math.min(i + 1, model.details.submodels.length - 1));
    }
    if (e.key === 'ArrowLeft') {
      setActiveSubTab(i => Math.max(i - 1, 0));
    }
  }, [model.details.submodels.length]);

  const currentSub = model.details.submodels[activeSubTab];

  return (
    <div
      className="vfm-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="vfm-modal"
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          ref={closeRef}
          className="vfm-modal-close"
          onClick={onClose}
          aria-label="关闭详情面板"
        >×</button>

        <div className="modal-header">
          <span className="modal-category">{model.category}</span>
          <h2 id="modal-title">{model.name} 深度指南</h2>
          <p className="modal-intro">{model.details.introduction}</p>
          {model.githubReadme && (
            <a
              href={model.githubReadme}
              target="_blank"
              rel="noreferrer"
              className="modal-github-link"
              aria-label={`在 GitHub 查看 ${model.name} 的完整研究文档（新标签页打开）`}
            >
              {GITHUB_SVG}
              在 GitHub 查看该模型的完整研究与原理解析 →
            </a>
          )}
        </div>

        {/* Sub Tabs — keyboard navigable (ArrowLeft/ArrowRight) */}
        <div className="modal-tabs" role="tablist" aria-label="子模型选择">
          {model.details.submodels.map((sub, idx) => (
            <button
              key={sub.name}
              role="tab"
              id={`tab-${idx}`}
              aria-selected={activeSubTab === idx}
              aria-controls={`tabpanel-${idx}`}
              className={`modal-tab ${activeSubTab === idx ? 'active' : ''}`}
              onClick={() => setActiveSubTab(idx)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              tabIndex={activeSubTab === idx ? 0 : -1}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="modal-tab-content"
          role="tabpanel"
          id={`tabpanel-${activeSubTab}`}
          aria-labelledby={`tab-${activeSubTab}`}
        >
          <h3>{currentSub.name}</h3>
          <p className="submodel-desc">{currentSub.desc}</p>

          <div className="code-container">
            <div className="code-header">
              <span>PyTorch Implementation</span>
              <span className="code-lang-badge">Python</span>
            </div>
            <pre>
              <code>{currentSub.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
});

// ──────────────────────────────────────────────
// Main App
// ──────────────────────────────────────────────
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModel, setActiveModel] = useState(null);

  // useMemo: avoid recomputing filtered list on every render (perf optimization)
  const filteredModels = useMemo(() =>
    selectedCategory === 'All'
      ? modelsData
      : modelsData.filter(m => m.category === selectedCategory),
    [selectedCategory]
  );

  // useCallback: stable references for handlers passed to children (perf optimization)
  const handleOpenModel = useCallback((model) => {
    setActiveModel(model);
  }, []);

  const handleCloseModel = useCallback(() => {
    setActiveModel(null);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat);
  }, []);

  const availableCount = useMemo(() => modelsData.filter(m => m.status === 'Available').length, []);
  const ongoingCount = useMemo(() => modelsData.filter(m => m.status === 'Ongoing').length, []);

  return (
    <div className="vfm-app">
      {/* Hero Header */}
      <header className="vfm-header" role="banner">
        <div className="vfm-header-content">
          <div className="vfm-badge">Research &amp; Implementations</div>
          <h1>Vision Foundation Model Guide</h1>
          <p className="vfm-subtitle">
            聚焦视觉语言对齐、自监督学习、开放域定位等核心计算机视觉基础模型（VFMs）的技术演化脉络。
          </p>

          {/* Stats bar */}
          <div className="vfm-stats" role="region" aria-label="数据概览">
            <div className="stat-item">
              <span className="stat-num">{modelsData.length}</span>
              <span className="stat-label">Models</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <span className="stat-num available">{availableCount}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <span className="stat-num ongoing">{ongoingCount}</span>
              <span className="stat-label">Ongoing</span>
            </div>
          </div>

          <div className="vfm-links">
            <a href="https://github.com/zzy1130/Vision-Foundation-Model" target="_blank" rel="noreferrer" className="vfm-btn vfm-btn-github">
              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              GitHub Repository
            </a>
            <a href="/" className="vfm-btn vfm-btn-back" aria-label="返回钟之羿个人主页">
              返回个人主页
            </a>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <nav className="vfm-filters-section" aria-label="模型分类筛选">
        <div className="vfm-container">
          <div className="vfm-filters" role="group" aria-label="Category filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Models Grid */}
      <main className="vfm-main" id="main-content">
        <div className="vfm-container">
          {filteredModels.length === 0 ? (
            <p className="empty-state">No models found in this category.</p>
          ) : (
            <div className="models-grid" role="list" aria-label="模型列表">
              {filteredModels.map(model => (
                <ModelCard key={model.id} model={model} onOpen={handleOpenModel} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detailed Overlay Modal */}
      {activeModel && (
        <ModalDetail model={activeModel} onClose={handleCloseModel} />
      )}

      {/* Footer */}
      <footer className="vfm-footer">
        <div className="vfm-container">
          <p>© {new Date().getFullYear()} Zhiyi Zhong (钟之羿). Built with React &amp; Vite · frontend-patterns skill applied.</p>
        </div>
      </footer>
    </div>
  );
}

