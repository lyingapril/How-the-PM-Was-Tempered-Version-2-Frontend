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
    createdAt: '2025-09-01',
    updatedAt: '2025-09-01',
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
    createdAt: '2025-08-28',
    updatedAt: '2025-08-30',
    productId: 'prod-1',
  },
  {
    id: '3',
    title: '修复iOS端支付失败问题',
    description: '部分iOS用户反馈支付宝支付后订单状态未更新，需排查支付回调逻辑。',
    status: DemandStatus.TESTING,
    priority: DemandPriority.HIGH,
    riceScore: 9.0,
    riceParams: { reach: 3000, impact: 5, confidence: 100, effort: 3 },
    tags: ['bug', '支付'],
    creator: '开发工程师B',
    createdAt: '2025-09-03',
    updatedAt: '2025-09-05',
    productId: 'prod-1',
  },
  {
    id: '4',
    title: '新增商品搜索历史功能',
    description: '记录用户最近搜索的10个关键词，点击可快速重新搜索。',
    status: DemandStatus.PENDING,
    priority: DemandPriority.LOW,
    riceScore: 2.1,
    riceParams: { reach: 8000, impact: 2, confidence: 70, effort: 2 },
    tags: ['用户体验', '搜索'],
    creator: '产品经理C',
    createdAt: '2025-08-25',
    updatedAt: '2025-08-25',
    productId: 'prod-2',
  },
  {
    id: '5',
    title: '优化首页加载速度',
    description: '当前首页首次加载平均耗时3.2秒，目标优化至1.5秒内（压缩图片、懒加载非核心组件）。',
    status: DemandStatus.DEVELOPING,
    priority: DemandPriority.MEDIUM,
    riceScore: 6.8,
    riceParams: { reach: 20000, impact: 3, confidence: 90, effort: 4 },
    tags: ['性能', '前端'],
    creator: '技术负责人D',
    createdAt: '2025-08-20',
    updatedAt: '2025-09-02',
    productId: 'prod-1',
  },
  {
    id: '6',
    title: '新增用户画像标签系统',
    description: '基于用户行为（浏览、购买、停留时长）自动生成标签，用于精准营销。',
    status: DemandStatus.PENDING,
    priority: DemandPriority.MEDIUM,
    riceScore: 4.5,
    riceParams: { reach: 15000, impact: 3, confidence: 60, effort: 8 },
    tags: ['数据', '用户运营'],
    creator: '数据分析师E',
    createdAt: '2025-08-15',
    updatedAt: '2025-08-15',
    productId: 'prod-2',
  },
  {
    id: '7',
    title: '修复安卓端图片上传旋转问题',
    description: '部分安卓机型上传竖屏照片后自动旋转为横屏，需统一处理图片方向。',
    status: DemandStatus.ONLINE,
    priority: DemandPriority.MEDIUM,
    riceScore: 3.7,
    riceParams: { reach: 4000, impact: 2, confidence: 95, effort: 3 },
    tags: ['bug', '移动端'],
    creator: '测试工程师F',
    createdAt: '2025-08-10',
    updatedAt: '2025-08-20',
    productId: 'prod-1',
  },
  {
    id: '8',
    title: '新增订单超时自动取消功能',
    description: '未支付订单超过15分钟自动取消，释放库存并发送提醒短信。',
    status: DemandStatus.TESTING,
    priority: DemandPriority.HIGH,
    riceScore: 7.2,
    riceParams: { reach: 6000, impact: 4, confidence: 90, effort: 3 },
    tags: ['订单', '自动化'],
    creator: '产品经理A',
    createdAt: '2025-09-02',
    updatedAt: '2025-09-04',
    productId: 'prod-2',
  },
  {
    id: '9',
    title: '新增帮助中心页面',
    description: '整合常见问题、联系客服、视频教程等入口，减少客服咨询量。',
    status: DemandStatus.PENDING,
    priority: DemandPriority.LOW,
    riceScore: 1.8,
    riceParams: { reach: 12000, impact: 1, confidence: 80, effort: 5 },
    tags: ['用户支持', '内容'],
    creator: '运营专员G',
    createdAt: '2025-08-05',
    updatedAt: '2025-08-05',
    productId: 'prod-1',
  },
  {
    id: '10',
    title: '优化购物车结算流程',
    description: '合并配送地址和支付方式页面，减少结算步骤从3步到2步。',
    status: DemandStatus.DEVELOPING,
    priority: DemandPriority.HIGH,
    riceScore: 8.0,
    riceParams: { reach: 9000, impact: 4, confidence: 95, effort: 4 },
    tags: ['转化', '电商'],
    creator: '产品经理C',
    createdAt: '2025-08-22',
    updatedAt: '2025-09-01',
    productId: 'prod-2',
  },
  {
    id: '11',
    title: '新增数据导出功能',
    description: '支持商家导出近30天的订单数据（Excel格式），包含商品、金额、用户信息。',
    status: DemandStatus.REJECTED,
    priority: DemandPriority.MEDIUM,
    riceScore: 3.5,
    riceParams: { reach: 1000, impact: 3, confidence: 85, effort: 6 },
    tags: ['商家端', '数据'],
    creator: '商家运营H',
    createdAt: '2025-08-18',
    updatedAt: '2025-08-25',
    productId: 'prod-2',
  },
  {
    id: '12',
    title: '修复首页轮播图偶尔不显示问题',
    description: '部分用户首次打开APP时轮播图空白，刷新后恢复，需排查异步加载逻辑。',
    status: DemandStatus.ONLINE,
    priority: DemandPriority.MEDIUM,
    riceScore: 4.2,
    riceParams: { reach: 7000, impact: 2, confidence: 80, effort: 3 },
    tags: ['bug', '前端'],
    creator: '测试工程师F',
    createdAt: '2025-08-08',
    updatedAt: '2025-08-15',
    productId: 'prod-1',
  },
  {
    id: '13',
    title: '新增商品详情页视频展示',
    description: '支持上传商品视频，在详情页优先于图片展示，提升商品转化率。',
    status: DemandStatus.PENDING,
    priority: DemandPriority.MEDIUM,
    riceScore: 5.8,
    riceParams: { reach: 8000, impact: 3, confidence: 75, effort: 7 },
    tags: ['商品', '多媒体'],
    creator: '产品经理A',
    createdAt: '2025-09-04',
    updatedAt: '2025-09-04',
    productId: 'prod-2',
  },
  {
    id: '14',
    title: '优化推送通知策略',
    description: '根据用户活跃时间段推送消息（如工作日晚8-10点），提高打开率。',
    status: DemandStatus.DEVELOPING,
    priority: DemandPriority.LOW,
    riceScore: 2.5,
    riceParams: { reach: 15000, impact: 2, confidence: 60, effort: 4 },
    tags: ['用户运营', '推送'],
    creator: '运营专员G',
    createdAt: '2025-08-26',
    updatedAt: '2025-09-03',
    productId: 'prod-1',
  },
  {
    id: '15',
    title: '新增会员积分兑换功能',
    description: '用户可使用积分兑换优惠券或实物商品，需对接现有积分系统和库存系统。',
    status: DemandStatus.PENDING,
    priority: DemandPriority.HIGH,
    riceScore: 7.6,
    riceParams: { reach: 6000, impact: 4, confidence: 85, effort: 6 },
    tags: ['会员', '商业化'],
    creator: '产品经理C',
    createdAt: '2025-08-30',
    updatedAt: '2025-08-30',
    productId: 'prod-2',
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