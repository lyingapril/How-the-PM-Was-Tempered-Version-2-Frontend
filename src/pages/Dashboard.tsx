import { useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag } from 'antd';
import { 
  OrderedListOutlined as DemandOutlined, 
  BranchesOutlined as VersionOutlined, 
  FileTextOutlined,
  AlertOutlined
} from '@ant-design/icons';
import { 
  PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, 
  LineChart, Line 
} from 'recharts';
import { useDashboardStore } from '../store/dashboardStore';
import { initDashboardStats } from '../store/dashboardStore';
import { DemandStatus, DemandPriority, DocumentStatus } from '../types';

// 颜色映射
const COLORS = {
  demandStatus: {
    [DemandStatus.PENDING]: '#FAAD14',
    [DemandStatus.DEVELOPING]: '#1890FF',
    [DemandStatus.TESTING]: '#722ED1',
    [DemandStatus.ONLINE]: '#52C41A',
    [DemandStatus.REJECTED]: '#F5222D',
  },
  priority: {
    [DemandPriority.HIGH]: '#F5222D',
    [DemandPriority.MEDIUM]: '#FAAD14',
    [DemandPriority.LOW]: '#52C41A',
  },
  documentStatus: {
    [DocumentStatus.DRAFT]: '#FAAD14',
    [DocumentStatus.PUBLISHED]: '#52C41A',
    [DocumentStatus.ARCHIVED]: '#8C8C8C',
  }
};

const DashboardPage = () => {
  const { demandStats, roadmapStats, documentStats } = useDashboardStore();

  // 初始化数据（监听其他模块数据变化时重新计算）
  useEffect(() => {
    initDashboardStats();
    // 监听需求/版本/文档变化，实时更新看板（简化：每30秒刷新一次）
    const timer = setInterval(initDashboardStats, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-page">
      {/* 顶部关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="总需求数" 
              value={Object.values(demandStats.byStatus).reduce((a, b) => a + b, 0)} 
              prefix={<DemandOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="进行中版本" 
              value={roadmapStats.progress.filter(v => v.progress > 0 && v.progress < 100).length} 
              prefix={<VersionOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="已发布文档" 
              value={documentStats.byStatus[DocumentStatus.PUBLISHED] || 0} 
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="延期版本" 
              value={roadmapStats.delayed} 
              prefix={<AlertOutlined />}
              valueStyle={{ color: roadmapStats.delayed > 0 ? '#F5222D' : '#52C41A' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 中间图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 需求状态分布 */}
        <Col xs={24} lg={12}>
          <Card title="需求状态分布">
            <PieChart width={300} height={300}>
              <Pie
                data={Object.entries(demandStats.byStatus).filter(([_, count]) => count > 0).map(([status, count]) => ({ name: status, value: count }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={50}
              >
                {Object.entries(demandStats.byStatus).map(([status]) => (
                  <Cell key={status} fill={COLORS.demandStatus[status as DemandStatus]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>

        {/* 需求优先级分布 */}
        <Col xs={24} lg={12}>
          <Card title="需求优先级分布">
            <PieChart width={300} height={300}>
              <Pie
                data={Object.entries(demandStats.byPriority).filter(([_, count]) => count > 0).map(([prio, count]) => ({ name: prio, value: count }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={50}
              >
                {Object.entries(demandStats.byPriority).map(([prio]) => (
                  <Cell key={prio} fill={COLORS.priority[prio as DemandPriority]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 需求创建趋势 */}
        <Col xs={24}>
          <Card title="近30天需求创建趋势">
            <LineChart data={demandStats.trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1890FF" />
            </LineChart>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 版本进度 */}
        <Col xs={24} lg={16}>
          <Card title="版本进度跟踪">
            {roadmapStats.progress.map((item) => (
              <div key={item.version} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{item.version}</span>
                  <span>{item.completed}/{item.total} 需求（{item.progress}%）</span>
                </div>
                <Progress percent={item.progress} status={item.progress === 100 ? 'success' : undefined} />
              </div>
            ))}
          </Card>
        </Col>

        {/* 文档指标 */}
        <Col xs={24} lg={8}>
          <Card title="文档状态与覆盖率">
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 8 }}>文档状态分布</h4>
              {Object.entries(documentStats.byStatus).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tag color={COLORS.documentStatus[status as DocumentStatus]} style={{ marginRight: 8 }}>
                      {status}
                    </Tag>
                  </div>
                  <span>{count} 份</span>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ marginBottom: 8 }}>需求文档覆盖率</h4>
              <Progress percent={documentStats.demandCoverage} status={documentStats.demandCoverage > 80 ? 'success' : undefined} />
              <p style={{ textAlign: 'right', marginTop: 4, fontSize: 12 }}>
                {documentStats.demandCoverage}% 需求已关联文档
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;