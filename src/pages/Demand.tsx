import { useState } from 'react';
import { Table, Button, Input, Select, Tag, Space, Popconfirm, message, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { type Demand, DemandStatus, DemandPriority } from '../types';
import { useDemandStore } from '../store/demandStore';
import DemandFormModal from '../components/demand/DemandFormModal'; // 后续创建的表单弹窗
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Search } = Input;

const DemandPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
  
  const { demands, deleteDemand } = useDemandStore();

  // 筛选逻辑
  const filteredDemands = demands.filter(demand => {
    // 搜索筛选（标题/描述）
    const matchesSearch = demand.title.includes(searchText) || demand.description.includes(searchText);
    // 状态筛选
    const matchesStatus = !statusFilter || demand.status === statusFilter;
    // 优先级筛选
    const matchesPriority = !priorityFilter || demand.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // 打开新增/编辑弹窗
  const handleOpenModal = (demand?: Demand) => {
    setEditingDemand(demand || null);
    setIsModalOpen(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    deleteDemand(id);
    message.success('需求已删除');
  };

  const columns: ColumnsType<Demand> = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: DemandStatus.PENDING, value: DemandStatus.PENDING },
        { text: DemandStatus.DEVELOPING, value: DemandStatus.DEVELOPING },
        { text: DemandStatus.TESTING, value: DemandStatus.TESTING },
        { text: DemandStatus.ONLINE, value: DemandStatus.ONLINE },
        { text: DemandStatus.REJECTED, value: DemandStatus.REJECTED },
      ],
      onFilter: (value: boolean | React.Key, record: Demand) => record.status === value,
      render: (status: DemandStatus) => {
        const colorMap: Record<DemandStatus, string> = {
          [DemandStatus.PENDING]: 'orange',
          [DemandStatus.DEVELOPING]: 'blue',
          [DemandStatus.TESTING]: 'purple',
          [DemandStatus.ONLINE]: 'green',
          [DemandStatus.REJECTED]: 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: DemandPriority.HIGH, value: DemandPriority.HIGH },
        { text: DemandPriority.MEDIUM, value: DemandPriority.MEDIUM },
        { text: DemandPriority.LOW, value: DemandPriority.LOW },
      ],
      onFilter: (value: boolean | React.Key, record: Demand) => record.priority === value,
      render: (priority: DemandPriority) => {
        const colorMap: Record<DemandPriority, string> = {
          [DemandPriority.HIGH]: 'red',
          [DemandPriority.MEDIUM]: 'orange',
          [DemandPriority.LOW]: 'green',
        };
        return <Tag color={colorMap[priority]}>{priority}</Tag>;
      },
    },
    {
      title: 'RICE分数',
      dataIndex: 'riceScore',
      key: 'riceScore',
      sorter: (a: Demand, b: Demand) => a.riceScore - b.riceScore,
    },
    {
      title: '标签',
      dataIndex: 'tags', // 对应数据中的 tags 字段
      key: 'tags',
      // 正确获取 tags 数组（value 即为 dataIndex 对应的值）
      render: (tags: string[] = []) => ( // 默认为空数组，避免 undefined
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Demand, b: Demand) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Demand) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该需求吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card title="需求管理" className="card-container">
        {/* 筛选与操作区 */}
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索需求标题/描述"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="状态筛选"
              style={{ width: '100%' }}
              allowClear
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            >
              <Option value={DemandStatus.PENDING}>{DemandStatus.PENDING}</Option>
              <Option value={DemandStatus.DEVELOPING}>{DemandStatus.DEVELOPING}</Option>
              <Option value={DemandStatus.TESTING}>{DemandStatus.TESTING}</Option>
              <Option value={DemandStatus.ONLINE}>{DemandStatus.ONLINE}</Option>
              <Option value={DemandStatus.REJECTED}>{DemandStatus.REJECTED}</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="优先级筛选"
              style={{ width: '100%' }}
              allowClear
              value={priorityFilter}
              onChange={(value) => setPriorityFilter(value)}
            >
              <Option value={DemandPriority.HIGH}>{DemandPriority.HIGH}</Option>
              <Option value={DemandPriority.MEDIUM}>{DemandPriority.MEDIUM}</Option>
              <Option value={DemandPriority.LOW}>{DemandPriority.LOW}</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={12} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleOpenModal()}
            >
              新增需求
            </Button>
          </Col>
        </Row>

        {/* 需求表格 */}
        <Table
          columns={columns}
          dataSource={filteredDemands}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: '暂无需求数据，请点击"新增需求"创建' }}
        />
      </Card>

      {/* 新增/编辑需求弹窗 */}
      <DemandFormModal
        visible={isModalOpen}
        demand={editingDemand}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DemandPage;