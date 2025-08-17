import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DemandCard from './DemandCard';
import  { type Demand, DemandPriority, DemandStatus } from '../../types';

// 需求列表容器（提供拖拽环境）
const DemandList: React.FC = () => {
  // 模拟需求数据
  const [demands, setDemands] = useState<Demand[]>([
    {
      id: '1',
      title: '优化登录流程',
      description: '减少登录步骤，提升用户体验',
      priority: DemandPriority.HIGH,
      status: DemandStatus.PENDING,
      riceScore: 0,
      riceParams: {
        reach: 0,
        impact: 0,
        confidence: 0,
        effort: 0
      },
      tags: [],
      creator: '',
      createdAt: '',
      updatedAt: '',
      productId: ''
    },
    {
      id: '2',
      title: '新增数据仪表盘',
      description: '展示核心指标趋势',
      priority: DemandPriority.MEDIUM,
      status: DemandStatus.PENDING,
      riceScore: 0,
      riceParams: {
        reach: 0,
        impact: 0,
        confidence: 0,
        effort: 0
      },
      tags: [],
      creator: '',
      createdAt: '',
      updatedAt: '',
      productId: ''
    },
    {
      id: '3',
      title: '修复移动端适配问题',
      description: '解决iPhone SE等小屏设备显示异常',
      priority: DemandPriority.LOW,
      status: DemandStatus.PENDING,
      riceScore: 0,
      riceParams: {
        reach: 0,
        impact: 0,
        confidence: 0,
        effort: 0
      },
      tags: [],
      creator: '',
      createdAt: '',
      updatedAt: '',
      productId: ''
    }
  ]);

  // 处理需求移动
  const handleDemandMove = (fromIndex: number, toIndex: number) => {
    const newDemands = [...demands];
    const [movedDemand] = newDemands.splice(fromIndex, 1); // 移除原位置
    newDemands.splice(toIndex, 0, movedDemand); // 插入新位置
    setDemands(newDemands);
  };

  return (
    // 提供拖拽上下文，整个应用只需一个DndProvider
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: 20 }}>
        <h2>需求列表（可拖拽排序）</h2>
        {demands.map((demand, index) => (
          <DemandCard
            key={demand.id}
            demand={demand}
            index={index}
            onMove={handleDemandMove}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default DemandList;
