// 需求状态枚举
export enum DemandStatus {
  PENDING = '待评审',
  DEVELOPING = '开发中',
  TESTING = '测试中',
  ONLINE = '已上线',
  REJECTED = '已驳回',
}

// 需求优先级（基于RICE模型计算结果）
export enum DemandPriority {
  HIGH = '高',
  MEDIUM = '中',
  LOW = '低',
}

// 完善需求类型
export interface Demand {
  id: string; // 唯一标识
  title: string; // 需求标题
  description: string; // 需求描述
  status: DemandStatus; // 状态
  priority: DemandPriority; // 优先级
  riceScore: number; // RICE模型分数（用于排序）
  // RICE模型参数
  riceParams: {
    reach: number; // 影响用户数
    impact: number; // 影响程度（1-5）
    confidence: number; // 置信度（0-100%）
    effort: number; // 开发成本（人天）
  };
  tags: string[]; // 标签（如“用户体验”“商业化”）
  creator: string; // 创建人
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  productId: string; // 所属产品ID（多产品场景）
}

// 文档状态
export enum DocumentStatus {
  DRAFT = '草稿',
  PUBLISHED = '已发布',
  ARCHIVED = '已归档',
}

// 文档类型
export interface Document {
  id: string; // 唯一标识
  title: string; // 文档标题
  content: string; // 富文本内容（HTML格式）
  status: DocumentStatus; // 状态
  demandId?: string; // 关联需求ID（可选，与需求管理联动）
  tags: string[]; // 标签（如“功能PRD”“UI规范”）
  version: number; // 版本号（初始1.0，每次编辑+0.1）
  creator: string; // 创建人
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 产品版本状态
export enum RoadmapStatus {
  PLANNING = '规划中',
  DEVELOPING = '进行中',
  COMPLETED = '已完成',
}

// 版本规划类型定义
export interface RoadmapVersion {
  version: string;
  status: '进行中' | '已完成' | '规划中';
  timeRange: string;
  features: string[];
}

// 版本规划项（每个版本包含的需求）
export interface RoadmapItem {
  id: string; // 唯一标识
  version: string; // 版本号（如V2.3）
  status: RoadmapStatus; // 版本状态
  startTime: string; // 开始时间（YYYY-MM-DD）
  endTime: string; // 结束时间
  description: string; // 版本描述
  demandIds: string[]; // 关联的需求ID（与需求管理模块联动）
  owner: string; // 负责人
}

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'pm' | 'developer' | 'tester' | 'admin';
}
