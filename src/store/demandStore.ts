import { create } from 'zustand';
import { type Demand, DemandStatus, DemandPriority } from '../types';
import { v4 as uuidv4 } from 'uuid'; 

// 初始模拟数据
const initialDemands: Demand[] = [
  {
    id: '1',
    title: '优化注册流程，减少填写项',
    description: '当前注册需填写6项信息，用户反馈繁琐，建议保留手机号+验证码即可完成注册，其他信息后期补填。',
    status: DemandStatus.PENDING,
    priority: DemandPriority.HIGH,
    riceScore: 8.5,
    riceParams: { reach: 10000, impact: 4, confidence: 90, effort: 2 },
    tags: ['用户体验', '转化'],
    creator: '产品经理A',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01',
    productId: 'prod-1',
  },
  {
    id: '2',
    title: '新增会员等级体系',
    description: '根据用户消费金额划分3个等级，对应不同权益（折扣、专属客服等），提升用户粘性。',
    status: DemandStatus.DEVELOPING,
    priority: DemandPriority.MEDIUM,
    riceScore: 5.2,
    riceParams: { reach: 5000, impact: 3, confidence: 80, effort: 5 },
    tags: ['商业化', '用户运营'],
    creator: '产品经理A',
    createdAt: '2024-08-28',
    updatedAt: '2024-08-30',
    productId: 'prod-1',
  },
];

interface DemandStore {
  demands: Demand[];
  // 查找单个需求
  getDemandById: (id: string) => Demand | undefined;
  // 创建需求
  createDemand: (demand: Omit<Demand, 'id' | 'createdAt' | 'updatedAt' | 'riceScore' | 'priority'>) => void;
  // 更新需求
  updateDemand: (id: string, data: Partial<Demand>) => void;
  // 删除需求
  deleteDemand: (id: string) => void;
  // 计算RICE分数并转换为优先级
  calculateRICE: (params: Demand['riceParams']) => { score: number; priority: DemandPriority };
}

export const useDemandStore = create<DemandStore>((set, get) => ({
  demands: initialDemands,

  getDemandById: (id) => {
    return get().demands.find(d => d.id === id);
  },

  createDemand: (demand) => {
    const { calculateRICE } = get();
    const riceResult = calculateRICE(demand.riceParams);
    const newDemand: Demand = {
      ...demand,
      id: uuidv4(),
      riceScore: riceResult.score,
      priority: riceResult.priority,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    set(state => ({ demands: [...state.demands, newDemand] }));
  },

  updateDemand: (id, data) => {
    set(state => ({
      demands: state.demands.map(d => {
        if (d.id === id) {
          // 若更新了RICE参数，重新计算分数和优先级
          if (data.riceParams) {
            const { calculateRICE } = get();
            const riceResult = calculateRICE(data.riceParams);
            return { ...d, ...data, riceScore: riceResult.score, priority: riceResult.priority, updatedAt: new Date().toISOString().split('T')[0] };
          }
          return { ...d, ...data, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return d;
      }),
    }));
  },

  deleteDemand: (id) => {
    set(state => ({ demands: state.demands.filter(d => d.id !== id) }));
  },

  // RICE模型计算逻辑：(Reach × Impact × Confidence) / Effort
  calculateRICE: (params) => {
    const { reach, impact, confidence, effort } = params;
    // 处理异常值（避免除以0）
    const safeEffort = effort <= 0 ? 1 : effort;
    const score = (reach * impact * (confidence / 100)) / safeEffort;
    
    // 根据分数划分优先级（可自定义阈值）
    if (score >= 7) return { score: Math.round(score * 10) / 10, priority: DemandPriority.HIGH };
    if (score >= 3) return { score: Math.round(score * 10) / 10, priority: DemandPriority.MEDIUM };
    return { score: Math.round(score * 10) / 10, priority: DemandPriority.LOW };
  },
}));