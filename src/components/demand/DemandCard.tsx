import React from 'react';
import { useDrag, useDrop, type DragSourceMonitor, type DropTargetMonitor } from 'react-dnd';
import { Card, Tag } from 'antd';
import type { Demand } from '../../types';

const DEMAND_TYPE = 'demand';

interface DemandCardProps {
  demand: Demand;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const DemandCard: React.FC<DemandCardProps> = ({ demand, index, onMove }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // 拖拽源配置
  const [{ isDragging }, drag] = useDrag({
    type: DEMAND_TYPE,
    item: () => ({ id: demand.id, index }),
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 放置目标配置
  const [, drop] = useDrop({
    accept: DEMAND_TYPE,
    hover: (item: { id: string; index: number }, monitor: DropTargetMonitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const rect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - rect.top : 0;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ marginBottom: 8 }}>
      <Card 
        title={demand.title}
        bordered
        style={{ 
          opacity: isDragging ? 0.5 : 1, // 使用解构出来的 isDragging
          cursor: 'move'
        }}
      >
        <p>{demand.description}</p>
        <Tag color={getPriorityColor(demand.priority)}>
          {demand.priority}
        </Tag>
      </Card>
    </div>
  );
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case '高': return 'red';
    case '中': return 'orange';
    case '低': return 'green';
    default: return 'blue';
  }
};

export default DemandCard;