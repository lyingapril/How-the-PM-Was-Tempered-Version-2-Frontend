import { useState, useRef } from 'react';
import { Card, Button, Space, Timeline, Tag, Popconfirm, Row, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { DragSourceMonitor, DropTargetMonitor, XYCoord } from 'react-dnd';
import { type RoadmapItem, RoadmapStatus } from '../types';
import { useRoadmapStore } from '../store/roadmapStore';
import RoadmapFormModal from '../components/roadmap/RoadmapFormModal';

// 拖拽用的版本卡片组件
const RoadmapCard = ({ 
  item, 
  index, 
  moveItem,
  onEdit,
  onDelete   
}: { 
  item: RoadmapItem; 
  index: number; 
  moveItem: (from: number, to: number) => void;
  onEdit: (item: RoadmapItem) => void;
  onDelete: (id: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ROADMAP_ITEM',
    item: { type: 'ROADMAP_ITEM', id: item.id, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'ROADMAP_ITEM',
    hover: (item: any, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const draggedItemIndex = item.index;
      const targetIndex = index;
      
      // 避免自己拖到自己的位置
      if (draggedItemIndex === targetIndex) {
        return;
      }

      // 计算拖拽位置，决定是否需要移动
      const dragBox = ref.current.getBoundingClientRect();
      const dragMiddleY = (dragBox.bottom - dragBox.top) / 2;
      const clientOffset = monitor.getClientOffset() as XYCoord;
      const hoverMiddleY = (clientOffset.y - dragBox.top) - dragMiddleY;

      // 向上拖拽
      if (draggedItemIndex < targetIndex && hoverMiddleY > 0) {
        return;
      }

      // 向下拖拽
      if (draggedItemIndex > targetIndex && hoverMiddleY < 0) {
        return;
      }

      // 执行移动
      moveItem(draggedItemIndex, targetIndex);
      item.index = targetIndex;
    },
  });

  // 状态标签样式
  const statusColorMap: Record<RoadmapStatus, string> = {
    [RoadmapStatus.PLANNING]: 'blue',
    [RoadmapStatus.DEVELOPING]: 'orange',
    [RoadmapStatus.COMPLETED]: 'green',
  };

  // 获取关联的需求标题
  const { getDemandsInVersion } = useRoadmapStore();
  const relatedDemands = getDemandsInVersion(item.demandIds);

  // 拖拽时的样式变化
  const opacity = isDragging ? 0.5 : 1;

  return (
    <div 
      // 修正ref组合方式
      ref={(node) => {
        if (!node) return;
        ref.current = node;
        dragRef(dropRef(node)); // Apply both drag and drop connectors
      }}
      style={{ 
        padding: 16, 
        marginBottom: 16, 
        border: '1px solid #e8e8e8', 
        borderRadius: 4,
        backgroundColor: '#fff',
        cursor: 'move',
        transition: 'box-shadow 0.2s, opacity 0.2s',
        opacity
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <h3 style={{ margin: 0 }}>{item.version}</h3>
          <Tag color={statusColorMap[item.status]}>
            {item.status}
          </Tag>
        </Space>
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => onEdit(item)}
          />
          <Popconfirm
            title="确定删除该版本？"
            onConfirm={() => onDelete(item.id)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      </div>

      <div style={{ margin: '12px 0' }}>
        <p style={{ margin: 0, color: '#666' }}>
          {item.startTime} — {item.endTime}
        </p>
        <p style={{ margin: '8px 0 0 0' }}>{item.description}</p>
      </div>

      <div>
        <p style={{ margin: '12px 0 8px 0', fontSize: 12, color: '#888' }}>
          关联需求 ({relatedDemands.length})
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {relatedDemands.map((demand: any) => (
            // 修正Tag组件属性，Ant Design的Tag组件没有size属性，使用style控制
            <Tag key={demand.id} style={{ backgroundColor: '#f5f5f5', fontSize: '12px', padding: '2px 8px' }}>
              {demand.title.slice(0, 10)}
              {demand.title.length > 10 && '...'}
            </Tag>
          ))}
          {relatedDemands.length === 0 && (
            <Tag color="gray" style={{ fontSize: '12px', padding: '2px 8px' }}>未关联需求</Tag>
          )}
        </div>
      </div>
    </div>
  );
};

const RoadmapPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const { roadmapItems, reorderRoadmap } = useRoadmapStore();

  // 打开新增/编辑弹窗
  const handleOpenModal = (item?: RoadmapItem) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string): void => {
    // 从 store 中删除指定 id 的 roadmap item
    useRoadmapStore.getState().deleteRoadmapItem(id);
    message.success('版本规划已删除');
  }

  return (
    <div className="page-container">
      <Card title="产品规划" className="card-container">
        <Row justify="end" style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => handleOpenModal()}
          >
            新增版本规划
          </Button>
        </Row>

        {/* 版本时间线（支持拖拽排序） */}
        <DndProvider backend={HTML5Backend}>
          <Timeline 
            mode="left" 
            style={{ paddingLeft: 24 }}
            items={roadmapItems.map((item, index) => ({
              key: item.id,
              dot: <DragOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
              children: (
                <RoadmapCard 
                  item={item} 
                  index={index} 
                  moveItem={reorderRoadmap} 
                  onEdit={() => handleOpenModal(item)} 
                  onDelete={() => handleDelete(item.id)}
                />
              )
            }))}
          />
        </DndProvider>

        {/* 无数据提示 */}
        {roadmapItems.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: 48, 
            backgroundColor: '#fafafa', 
            borderRadius: 4 
          }}>
            <p>暂无版本规划，点击"新增版本规划"开始创建</p>
          </div>
        )}
      </Card>

      {/* 新增/编辑版本弹窗 */}
      <RoadmapFormModal
        visible={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RoadmapPage;
