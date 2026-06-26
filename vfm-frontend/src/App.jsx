import React, { useState } from 'react';

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
    status: 'Ongoing',
    summary: '物体 6D 位姿估计',
    description: '通用的物体 6D 位姿估计与追踪，无需针对特定目标进行模型微调，是具身智能抓取的核心底座。'
  },
  {
    id: 'depth-anything',
    category: '深度估计',
    name: 'Depth Anything v1/v2',
    status: 'Ongoing',
    summary: '单目深度预测',
    description: '通用的单目三维深度预测模型，通过自监督训练和合成数据混训，在未知户外和户内场景中表现出极强的泛化深度预测力。'
  },
  {
    id: 'point-transformer',
    category: '点云表征',
    name: 'Point Transformer v3',
    status: 'Ongoing',
    summary: '点云表征',
    description: '通用的 3D 点云表征骨干网络，通过大规模稀疏自注意力机制在三维点云分割和分类任务中占据主流。'
  },
  {
    id: 'stable-diffusion',
    category: '生成',
    name: 'Stable Diffusion',
    status: 'Ongoing',
    summary: '生成目标图像或中间表征',
    description: '潜在扩散模型大成者，除了图像生成之外，常作为强大的密集表征提取骨干用于下游任务。'
  },
  {
    id: 'rdt-1b',
    category: '机器人 FM',
    name: 'RDT-1B',
    status: 'Ongoing',
    summary: '双臂操作基础模型',
    description: '双臂操作决策 Transformer，是具身智能控制领域十亿参数级的动作预测基础模型。'
  },
  {
    id: 'siglip-ongoing',
    category: '图文对齐',
    name: 'SigLIP',
    status: 'Ongoing',
    summary: '图文对齐',
    description: 'Google 提出的高效多模态对齐骨干，集成 Sigmoid 对比二分类损失，目前标注为 Ongoing 状态。'
  }
];

const categories = ['All', '图文对齐', '表征学习', '分割', '分割追踪', '3D 重建', '开放词表检测', '检测 + 分割', '位姿追踪', '深度估计', '点云表征', '生成', '机器人 FM'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModel, setActiveModel] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(0);

  const filteredModels = selectedCategory === 'All'
    ? modelsData
    : modelsData.filter(m => m.category === selectedCategory);

  return (
    <div className="vfm-app">
      {/* Hero Header */}
      <header className="vfm-header">
        <div className="vfm-header-content">
          <div className="vfm-badge">Research &amp; Implementations</div>
          <h1>Vision Foundation Model Guide</h1>
          <p className="vfm-subtitle">
            聚焦视觉语言对齐、自监督学习、开放域定位等核心计算机视觉基础模型（VFMs）的技术演化脉络。
          </p>
          <div className="vfm-links">
            <a href="https://github.com/zzy1130/Vision-Foundation-Model" target="_blank" rel="noreferrer" className="vfm-btn vfm-btn-github">
              <svg viewBox="0 0 24 24" className="icon"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              GitHub Repository
            </a>
            <a href="/" className="vfm-btn vfm-btn-back">
              返回个人主页
            </a>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="vfm-filters-section">
        <div className="vfm-container">
          <div className="vfm-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <main className="vfm-main">
        <div className="vfm-container">
          <div className="models-grid">
            {filteredModels.map(model => (
              <div key={model.id} className="model-card">
                <div className="model-card-header">
                  <span className="card-category">{model.category}</span>
                  <span className={`status-badge ${model.status.toLowerCase()}`}>{model.status}</span>
                </div>
                <h3 className="model-card-title">{model.name}</h3>
                <p className="model-card-summary">{model.summary}</p>
                <p className="model-card-desc">{model.description}</p>
                <div className="model-card-footer">
                  {model.status === 'Available' ? (
                    <button
                      className="explore-btn"
                      onClick={() => {
                        setActiveModel(model);
                        setActiveSubTab(0);
                      }}
                    >
                      阅读技术指南 →
                    </button>
                  ) : (
                    <span className="ongoing-tag">开发进行中 (Ongoing)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Detailed Overlay Modal */}
      {activeModel && (
        <div className="vfm-modal-backdrop" onClick={() => setActiveModel(null)}>
          <div className="vfm-modal" onClick={e => e.stopPropagation()}>
            <button className="vfm-modal-close" onClick={() => setActiveModel(null)}>×</button>
            
            <div className="modal-header">
              <span className="modal-category">{activeModel.category}</span>
              <h2>{activeModel.name} 深度指南</h2>
              <p className="modal-intro">{activeModel.details.introduction}</p>
              {activeModel.githubReadme && (
                <a
                  href={activeModel.githubReadme}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-github-link"
                >
                  <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                  在 GitHub 查看该模型的完整研究与原理解析 →
                </a>
              )}
            </div>

            {/* Sub Tabs */}
            <div className="modal-tabs">
              {activeModel.details.submodels.map((sub, idx) => (
                <button
                  key={sub.name}
                  className={`modal-tab ${activeSubTab === idx ? 'active' : ''}`}
                  onClick={() => setActiveSubTab(idx)}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="modal-tab-content">
              <h3>{activeModel.details.submodels[activeSubTab].name}</h3>
              <p className="submodel-desc">{activeModel.details.submodels[activeSubTab].desc}</p>
              
              <div className="code-container">
                <div className="code-header">
                  <span>PyTorch Implementation</span>
                </div>
                <pre>
                  <code>{activeModel.details.submodels[activeSubTab].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="vfm-footer">
        <div className="vfm-container">
          <p>© {new Date().getFullYear()} Zhiyi Zhong (钟之羿). Built with React &amp; Vite.</p>
        </div>
      </footer>
    </div>
  );
}
