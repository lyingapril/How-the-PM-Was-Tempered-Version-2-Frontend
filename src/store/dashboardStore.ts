import { create } from 'zustand';
import { useDemandStore } from './demandStore';
import { useRoadmapStore } from './roadmapStore';
import { useDocumentStore } from './documentStore';
import { DemandStatus, DemandPriority, RoadmapStatus } from '../types';

interface DashboardStore {
  // 需求相关指标
  demandStats: {
    byStatus: Record<DemandStatus, number>; // 按状态统计
    byPriority: Record<DemandPriority, number>; // 按优先级统计
    trend: { date: string; count: number }[]; // 近30天创建趋势
  };
  // 版本相关指标
  roadmapStats: {
    progress: {
      progress: number; version: string; completed: number; total: number 
}[]; // 各版本进度
    delayed: number; // 延期版本数
  };
  // 文档相关指标
  documentStats: {
    byStatus: Record<string, number>; // 按状态统计
    demandCoverage: number; // 关联需求的文档覆盖率（%）
  };
}

export const useDashboardStore = create<DashboardStore>(() => ({
  // 初始化及实时计算指标
  demandStats: {
    byStatus: {
        [DemandStatus.PENDING]: 0,
        [DemandStatus.DEVELOPING]: 0,
        [DemandStatus.TESTING]: 0,
        [DemandStatus.ONLINE]: 0,
        [DemandStatus.REJECTED]: 0
    },
    byPriority: {
        [DemandPriority.HIGH]: 0,
        [DemandPriority.MEDIUM]: 0,
        [DemandPriority.LOW]: 0
    },
    trend: [],
  },
  roadmapStats: {
    progress: [],
    delayed: 0,
  },
  documentStats: {
    byStatus: {},
    demandCoverage: 0,
  },
}));

// 监听数据变化，实时更新指标（在页面初始化时调用）
export const initDashboardStats = () => {
  const { demands } = useDemandStore.getState();
  const { roadmapItems } = useRoadmapStore.getState();
  const { documents } = useDocumentStore.getState();

  // 1. 计算需求指标
  const demandByStatus = Object.values(DemandStatus).reduce((acc, status) => {
    acc[status] = demands.filter(d => d.status === status).length;
    return acc;
  }, {} as Record<DemandStatus, number>);

  const demandByPriority = Object.values(DemandPriority).reduce((acc, priority) => {
    acc[priority] = demands.filter(d => d.priority === priority).length;
    return acc;
  }, {} as Record<DemandPriority, number>);

  // 近30天创建趋势（简化：按创建日期分组）
  const demandTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    return {
      date: dateStr,
      count: demands.filter(d => d.createdAt === dateStr).length,
    };
  });

  // 2. 计算版本指标
  const roadmapProgress = roadmapItems.map(item => {
    const total = item.demandIds.length;
    const completed = item.demandIds.filter(demandId => {
      const demand = demands.find(d => d.id === demandId);
      return demand?.status === DemandStatus.ONLINE;
    }).length;
    return {
      version: item.version,
      completed,
      total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // 延期版本数（结束时间早于今天且未完成）
  const today = new Date().toISOString().split('T')[0];
  const delayedVersions = roadmapItems.filter(item => {
    return item.endTime < today && item.status !== RoadmapStatus.COMPLETED;
  }).length;

  // 3. 计算文档指标
  const docByStatus = documents.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 关联需求覆盖率（有文档的需求数 / 总需求数）
  const documentedDemandIds = new Set(documents.map(doc => doc.demandId).filter(Boolean));
  const demandCoverage = demands.length > 0 
    ? Math.round((documentedDemandIds.size / demands.length) * 100) 
    : 0;

  // 更新看板数据
  useDashboardStore.setState({
    demandStats: { byStatus: demandByStatus, byPriority: demandByPriority, trend: demandTrend },
    roadmapStats: { progress: roadmapProgress, delayed: delayedVersions },
    documentStats: { byStatus: docByStatus, demandCoverage },
  });
};