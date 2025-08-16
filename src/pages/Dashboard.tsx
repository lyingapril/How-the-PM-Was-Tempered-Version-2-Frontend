import React from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

// 模拟数据指标
const metricData = [
  { title: '总需求数', value: 128, change: 12, status: 'up' },
  { title: '已上线需求', value: 86, change: 8, status: 'up' },
  { title: '延期需求', value: 12, change: -3, status: 'down' },
  { title: '用户反馈数', value: 356, change: 42, status: 'up' },
];

// 需求状态分布数据
const demandStatusData = [
  { type: '待评审', value: 24 },
  { type: '开发中', value: 38 },
  { type: '测试中', value: 16 },
  { type: '已上线', value: 86 },
];

// 需求优先级分布数据
const priorityData = [
  { type: '高', value: 42 },
  { type: '中', value: 56 },
  { type: '低', value: 30 },
];

// 月度需求趋势数据
const monthlyTrendData = [
  { month: '6月', 新增需求: 18, 已完成: 15 },
  { month: '7月', 新增需求: 25, 已完成: 20 },
  { month: '8月', 新增需求: 32, 已完成: 28 },
  { month: '9月', 新增需求: 29, 已完成: 22 },
  { month: '10月', 新增需求: 44, 已完成: 31 },
];

// 最近需求进度数据
const recentDemandData = [
  {
    id: '1',
    title: '优化用户注册流程',
    status: '开发中',
    progress: 60,
    deadline: '2023-10-30'
  },
  {
    id: '2',
    title: '增加数据导出功能',
    status: '待评审',
    progress: 0,
    deadline: '2023-11-15'
  },
  {
    id: '3',
    title: '优化移动端适配',
    status: '测试中',
    progress: 80,
    deadline: '2023-10-25'
  },
  {
    id: '4',
    title: '增加深色模式',
    status: '规划中',
    progress: 0,
    deadline: '2023-12-10'
  },
];

const DashboardPage: React.FC = () => {
  // 状态标签样式
  const getStatusTag = (status: string) => {
    const statusConfig = {
      '待评审': { color: 'default', text: '待评审' },
      '开发中': { color: 'processing', text: '开发中' },
      '测试中': { color: 'warning', text: '测试中' },
      '已上线': { color: 'success', text: '已上线' },
      '规划中': { color: 'info', text: '规划中' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['待评审'];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 折线图配置
  const lineConfig = {
    data: monthlyTrendData,
    xField: 'month',
    yField: ['新增需求', '已完成'],
    point: {
      size: 5,
      shape: 'diamond',
    },
    legend: {
      position: 'top',
    },
  };

  // 饼图配置 - 需求状态分布
  const statusPieConfig = {
    data: demandStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
    },
  };

  // 饼图配置 - 优先级分布
  const priorityPieConfig = {
    data: priorityData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
    },
    color: ['#f5222d', '#faad14', '#52c41a'],
  };

  // 最近需求表格列配置
  const demandColumns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '100px',
            height: '6px',
            background: '#e8e8e8',
            borderRadius: '3px',
            overflow: 'hidden',
            marginRight: 8
          }}>
            <div style={{
              height: '100%',
              background: '#1890ff',
              width: `${progress}%`
            }} />
          </div>
          <Text>{progress}%</Text>
        </div>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ fontSize: '14px', marginRight: 4, color: '#faad14' }} />
          <Text>{deadline}</Text>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>数据仪表盘</Title>
      
      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {metricData.map((metric, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={metric.title}
                value={metric.value}
                precision={0}
                valueStyle={{ 
                  color: metric.status === 'up' ? '#52c41a' : '#f5222d' 
                }}
                prefix={metric.status === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix={`${metric.change}%`}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="月度需求趋势">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="需求状态分布">
            <Pie {...statusPieConfig} />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="需求优先级分布">
            <Pie {...priorityPieConfig} />
          </Card>
        </Col>
      </Row>

      {/* 最近需求进度 */}
      <Row>
        <Col span={24}>
          <Card title="最近需求进度">
            <Table
              columns={demandColumns}
              dataSource={recentDemandData}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
