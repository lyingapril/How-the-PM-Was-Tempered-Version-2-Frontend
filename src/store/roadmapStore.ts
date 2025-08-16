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
    startTime: '2024-06-01',
    endTime: '2024-08-30',
    description: '核心功能上线：用户注册、需求管理基础功能',
    demandIds: ['1'], // 关联需求ID
    owner: '产品经理A',
  },
  {
    id: 'v2',
    version: 'V2.0',
    status: RoadmapStatus.DEVELOPING,
    startTime: '2024-09-01',
    endTime: '2024-11-30',
    description: '新增Roadmap规划、文档中心功能',
    demandIds: ['2'],
    owner: '产品经理A',
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