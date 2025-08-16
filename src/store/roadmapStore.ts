import { create } from 'zustand';
import { type RoadmapItem, RoadmapStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useDemandStore } from './demandStore'; // 关联需求数据

// 初始模拟数据
const initialRoadmap: RoadmapItem[] = [
  {
    id: 'v1',
    version: 'V1.0',
    status: RoadmapStatus.COMPLETED,
    startTime: '2025-06-01',
    endTime: '2025-08-30',
    description: '核心功能上线：用户注册、需求管理基础功能',
    demandIds: ['1', '7'], // 关联需求：注册优化、安卓图片上传修复
    owner: '产品经理A',
  },
  {
    id: 'v2',
    version: 'V2.0',
    status: RoadmapStatus.DEVELOPING,
    startTime: '2025-09-01',
    endTime: '2025-11-30',
    description: '新增Roadmap规划、文档中心功能，优化订单流程',
    demandIds: ['2', '8', '10'], // 关联需求：会员体系、订单取消、购物车优化
    owner: '产品经理A',
  },
  {
    id: 'v3',
    version: 'V3.0',
    status: RoadmapStatus.PLANNING,
    startTime: '2025-12-01',
    endTime: '2026-02-28',
    description: '数据看板与用户画像系统上线，支持精准运营',
    demandIds: ['6', '14'], // 关联需求：用户画像、推送策略
    owner: '产品经理C',
  },
  {
    id: 'v4',
    version: 'V2.1',
    status: RoadmapStatus.PLANNING,
    startTime: '2025-10-15',
    endTime: '2025-11-15',
    description: 'V2.0补丁版本：修复支付bug，优化首页性能',
    demandIds: ['3', '5'], // 关联需求：iOS支付修复、首页加载优化
    owner: '开发工程师B',
  },
  {
    id: 'v5',
    version: 'V3.1',
    status: RoadmapStatus.PLANNING,
    startTime: '2026-03-01',
    endTime: '2026-04-30',
    description: '会员积分体系完善，支持积分兑换',
    demandIds: ['15'], // 关联需求：积分兑换功能
    owner: '产品经理C',
  },
  {
    id: 'v6',
    version: 'V1.5',
    status: RoadmapStatus.COMPLETED,
    startTime: '2025-07-15',
    endTime: '2025-08-15',
    description: 'V1.0增强版：新增搜索历史与轮播图修复',
    demandIds: ['4', '12'], // 关联需求：搜索历史、轮播图修复
    owner: '产品经理A',
  },
  {
    id: 'v7',
    version: 'V4.0',
    status: RoadmapStatus.PLANNING,
    startTime: '2026-05-01',
    endTime: '2026-07-31',
    description: '商家端功能升级，支持数据导出与商品视频',
    demandIds: ['11', '13'], // 关联需求：数据导出、商品视频展示
    owner: '商家运营H',
  },
  {
    id: 'v8',
    version: 'V2.2',
    status: RoadmapStatus.PLANNING,
    startTime: '2025-11-01',
    endTime: '2025-11-20',
    description: '帮助中心与用户反馈系统',
    demandIds: ['9'], // 关联需求：帮助中心页面
    owner: '运营专员G',
  },
];


interface RoadmapStore {
  roadmapItems: RoadmapItem[];
  // 获取单个版本
  getRoadmapItem: (id: string) => RoadmapItem | undefined;
  // 创建版本
  createRoadmapItem: (item: Omit<RoadmapItem, 'id'>) => void;
  // 更新版本
  updateRoadmapItem: (id: string, data: Partial<RoadmapItem>) => void;
  // 删除版本
  deleteRoadmapItem: (id: string) => void;
  // 调整版本顺序（拖拽用）
  reorderRoadmap: (fromIndex: number, toIndex: number) => void;
  // 获取版本关联的需求列表
  getDemandsInVersion: (demandIds: string[]) => any[]; // 实际项目中需指定需求类型
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  roadmapItems: initialRoadmap,

  getRoadmapItem: (id) => get().roadmapItems.find(item => item.id === id),

  createRoadmapItem: (item) => {
    const newItem: RoadmapItem = { ...item, id: uuidv4() };
    set(state => ({ roadmapItems: [...state.roadmapItems, newItem] }));
  },

  updateRoadmapItem: (id, data) => {
    set(state => ({
      roadmapItems: state.roadmapItems.map(item => 
        item.id === id ? { ...item, ...data } : item
      ),
    }));
  },

  deleteRoadmapItem: (id) => {
    set(state => ({
      roadmapItems: state.roadmapItems.filter(item => item.id !== id),
    }));
  },

  // 调整版本顺序（用于拖拽排序）
  reorderRoadmap: (fromIndex, toIndex) => {
    set(state => {
      const newItems = [...state.roadmapItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return { roadmapItems: newItems };
    });
  },

  // 获取版本关联的需求详情（从需求库中匹配）
  getDemandsInVersion: (demandIds) => {
    const { demands } = useDemandStore.getState();
    return demandIds.map(id => demands.find(d => d.id === id)).filter(Boolean);
  },
}));