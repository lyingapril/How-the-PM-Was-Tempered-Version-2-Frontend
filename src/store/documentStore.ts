import { create } from 'zustand';
import { type Document, DocumentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 初始模拟数据
const initialDocuments: Document[] = [
  {
    id: 'doc1',
    title: '用户注册流程PRD',
    content: '<p>1. 注册流程包含手机号验证、密码设置两步<br>2. 手机号需支持国际区号切换<br>3. 密码强度需满足至少8位（字母+数字）<br>4. 注册成功后自动跳转至完善资料页（非强制）</p>',
    status: DocumentStatus.PUBLISHED,
    demandId: '1', // 关联需求ID:优化注册流程
    tags: ['PRD', '用户体验'],
    version: 1.2,
    creator: '产品经理A',
    createdAt: '2025-09-05',
    updatedAt: '2025-09-07',
  },
  {
    id: 'doc2',
    title: '会员等级体系设计方案',
    content: '<p>1. 等级划分：普通会员（0-999分）、黄金会员（1000-4999分）、钻石会员（5000+分）<br>2. 积分规则：消费1元=1积分，每日签到+5分<br>3. 权益详情：<br>- 黄金会员：生日券+免费退换货<br>- 钻石会员：专属客服+免运费</p>',
    status: DocumentStatus.PUBLISHED,
    demandId: '2', // 关联需求ID:新增会员等级体系
    tags: ['PRD', '会员体系'],
    version: 1.0,
    creator: '产品经理A',
    createdAt: '2025-08-29',
    updatedAt: '2025-08-29',
  },
  {
    id: 'doc3',
    title: 'iOS支付异常排查报告',
    content: '<p>问题现象：部分iOS用户支付宝支付后订单状态未同步<br>排查结果：支付宝回调接口在iOS 16.5+系统下存在兼容性问题<br>解决方案：<br>1. 增加支付结果主动查询机制（每30秒一次，共3次）<br>2. 优化前端状态显示逻辑，避免用户重复支付</p>',
    status: DocumentStatus.PUBLISHED,
    demandId: '3', // 关联需求ID:修复iOS端支付失败问题
    tags: ['bug', '支付', '技术'],
    version: 1.1,
    creator: '开发工程师B',
    createdAt: '2025-09-04',
    updatedAt: '2025-09-05',
  },
  {
    id: 'doc4',
    title: '首页性能优化方案',
    content: '<p>当前性能指标：首次加载3.2s，LCP 2.8s<br>优化目标：加载时间≤1.5s，LCP≤1.2s<br>实施步骤：<br>1. 图片压缩（WebP格式+懒加载）<br>2. 首屏JS体积削减40%（按需加载非核心组件）<br>3. 接口缓存策略调整（首页数据缓存10分钟）</p>',
    status: DocumentStatus.DRAFT,
    demandId: '5', // 关联需求ID:优化首页加载速度
    tags: ['性能', '前端', '方案'],
    version: 0.8,
    creator: '技术负责人D',
    createdAt: '2025-08-22',
    updatedAt: '2025-09-01',
  },
  {
    id: 'doc5',
    title: '用户画像标签体系说明',
    content: '<p>标签分类：<br>1. 基础属性（年龄、性别、地域）<br>2. 行为标签（浏览偏好、购买频率、活跃时段）<br>3. 偏好标签（价格敏感度、品类偏好）<br>数据来源：用户注册信息+埋点数据+订单数据</p>',
    status: DocumentStatus.DRAFT,
    demandId: '6', // 关联需求ID:新增用户画像标签系统
    tags: ['数据', '用户运营'],
    version: 1.0,
    creator: '数据分析师E',
    createdAt: '2025-08-16',
    updatedAt: '2025-08-16',
  },
  {
    id: 'doc6',
    title: '订单超时自动取消规则',
    content: '<p>1. 超时时间：普通商品15分钟，预售商品30分钟<br>2. 取消逻辑：<br>- 自动释放库存<br>- 发送短信提醒（取消前5分钟+取消后）<br>- 记录用户取消原因（可选填写）<br>3. 例外情况：VIP会员可享受一次30分钟延长机会</p>',
    status: DocumentStatus.DRAFT,
    demandId: '8', // 关联需求ID:新增订单超时自动取消功能
    tags: ['订单', '规则'],
    version: 1.0,
    creator: '产品经理A',
    createdAt: '2025-09-03',
    updatedAt: '2025-09-03',
  },
  {
    id: 'doc7',
    title: '购物车结算流程优化PRD',
    content: '<p>优化前：3步（购物车→地址→支付）<br>优化后：2步（购物车→地址+支付合并页）<br>关键改动：<br>1. 地址选择模块嵌入支付页顶部<br>2. 常用地址默认选中<br>3. 支付方式记忆上次选择</p>',
    status: DocumentStatus.PUBLISHED,
    demandId: '10', // 关联需求ID:优化购物车结算流程
    tags: ['PRD', '转化', '电商'],
    version: 1.1,
    creator: '产品经理C',
    createdAt: '2025-08-23',
    updatedAt: '2025-08-28',
  },
  {
    id: 'doc8',
    title: '商品详情页视频展示规范',
    content: '<p>1. 视频要求：时长≤60秒，大小≤50MB，格式MP4<br>2. 内容规范：需包含商品全貌+核心功能演示+使用场景<br>3. 展示逻辑：视频自动播放（静音），点击后全屏有声播放<br>4. 降级策略：无视频时显示默认图片组</p>',
    status: DocumentStatus.DRAFT,
    demandId: '13', // 关联需求ID:新增商品详情页视频展示
    tags: ['商品', '多媒体', '规范'],
    version: 0.5,
    creator: '产品经理A',
    createdAt: '2025-09-05',
    updatedAt: '2025-09-06',
  },
  {
    id: 'doc9',
    title: '推送通知策略白皮书',
    content: '<p>1. 推送时间段：<br>- 工作日：12:00-13:00，19:00-21:00<br>- 周末：10:00-11:00，15:00-17:00，20:00-22:00<br>2. 频率限制：单用户每日≤3条<br>3. 内容分类：营销类（占比≤40%）、服务类、系统类</p>',
    status: DocumentStatus.PUBLISHED,
    demandId: '14', // 关联需求ID:优化推送通知策略
    tags: ['用户运营', '推送', '规范'],
    version: 1.0,
    creator: '运营专员G',
    createdAt: '2025-08-27',
    updatedAt: '2025-08-27',
  },
  {
    id: 'doc10',
    title: '会员积分兑换功能设计',
    content: '<p>1. 兑换渠道：APP内兑换中心+小程序<br>2. 兑换比例：100积分=1元（等价）<br>3. 商品类型：<br>- 虚拟商品：优惠券、会员时长、流量包<br>- 实物商品：定制周边、合作品牌商品<br>4. 库存管理：每日限量，兑完即止</p>',
    status: DocumentStatus.DRAFT,
    demandId: '15', // 关联需求ID:新增会员积分兑换功能
    tags: ['会员', '商业化', 'PRD'],
    version: 0.7,
    creator: '产品经理C',
    createdAt: '2025-08-31',
    updatedAt: '2025-09-02',
  },
];


interface DocumentStore {
  documents: Document[];
  // 分页获取文档
  getDocuments: (page: number, pageSize: number) => {
    list: Document[];
    total: number;
  };
  // 获取单个文档
  getDocumentById: (id: string) => Document | undefined;
  // 创建文档
  createDocument: (doc: Omit<Document, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => void;
  // 更新文档（自动升级版本）
  updateDocument: (id: string, data: Partial<Document>) => void;
  // 删除文档
  deleteDocument: (id: string) => void;
  // 搜索文档（按标题/标签）
  searchDocuments: (keyword: string) => Document[];
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: initialDocuments,

  getDocuments: (page, pageSize) => {
    const list = get().documents;
    return {
      list: list.slice((page - 1) * pageSize, page * pageSize),
      total: list.length,
    };
  },

  getDocumentById: (id) => get().documents.find(doc => doc.id === id),

  createDocument: (doc) => {
    const newDoc: Document = {
      ...doc,
      id: uuidv4(),
      version: 1.0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    set(state => ({ documents: [...state.documents, newDoc] }));
  },

  updateDocument: (id, data) => {
    set(state => ({
      documents: state.documents.map(doc => {
        if (doc.id === id) {
          // 每次更新版本号+0.1
          const newVersion = (doc.version || 1.0) + 0.1;
          return { 
            ...doc, 
            ...data, 
            version: Number(newVersion.toFixed(1)), // 保留1位小数
            updatedAt: new Date().toISOString().split('T')[0] 
          };
        }
        return doc;
      }),
    }));
  },

  deleteDocument: (id) => {
    set(state => ({ documents: state.documents.filter(doc => doc.id !== id) }));
  },

  searchDocuments: (keyword) => {
    return get().documents.filter(doc => 
      doc.title.includes(keyword) || 
      doc.tags.some(tag => tag.includes(keyword))
    );
  },
}));