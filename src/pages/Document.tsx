import { useLayoutEffect, useState } from 'react';
import { Card, Button, Input, Tag, Table, Space, Popconfirm, message, Row, Col, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { type Document, DocumentStatus } from '../types';
import { useDocumentStore } from '../store/documentStore';
import DocumentFormModal from '../components/document/DocumentFormModal';
import DocumentDetailModal from '../components/document/DocumentDetailModal.tsx';
import { useDemandStore } from '../store/demandStore';

const { Option } = Select;
const { Search } = Input;

const DocumentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [currentDoc, setCurrentDoc] = useState<any>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { documents, deleteDocument, searchDocuments } = useDocumentStore();
  const { demands } = useDemandStore(); // 获取需求列表用于显示关联需求名称

  useLayoutEffect(() => {
    // 监听窗口大小变化
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // 小于1024px视为小屏
    };
    
    checkScreenSize(); // 初始化
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 筛选文档
  const filteredDocs = searchKeyword 
    ? searchDocuments(searchKeyword)
    : documents.filter(doc => !statusFilter || doc.status === statusFilter);

  // 获取关联需求名称
  const getDemandTitle = (demandId?: string) => {
    if (!demandId) return '无关联';
    const demand = demands.find(d => d.id === demandId);
    return demand?.title || '已删除需求';
  };

  const handleOpenDetail = (doc: Document) => {
    if (doc && doc.id) { // 确保文档存在且有唯一标识
      setCurrentDoc(doc);
      setIsDetailModalOpen(true);
    } else {
      message.warning('文档数据无效');
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '文档标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 100,
    },
    ...(isSmallScreen ? [] : [{
      title: '关联需求',
      key: 'demand',
      render: (_: DocumentType, record: Document) => getDemandTitle(record.demandId),
      ellipsis: true,
      width: 90,
    }]),
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: DocumentStatus.DRAFT, value: DocumentStatus.DRAFT },
        { text: DocumentStatus.PUBLISHED, value: DocumentStatus.PUBLISHED },
        { text: DocumentStatus.ARCHIVED, value: DocumentStatus.ARCHIVED },
      ],
      render: (status: DocumentStatus) => {
        const colorMap: Record<DocumentStatus, string> = {
          [DocumentStatus.DRAFT]: 'orange',
          [DocumentStatus.PUBLISHED]: 'green',
          [DocumentStatus.ARCHIVED]: 'gray',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
      width: 50,
    },
    ...(isSmallScreen ? [] : [{
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 40,
    }]),
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: any[]) => {
        if (tags.length > 2) {
          return (
            <Space size="small">
              {tags.slice(0, 2).map(tag => <Tag key={tag}>{tag}</Tag>)}
              <Tag>{`+${tags.length - 2}`}</Tag>
            </Space>
          );
        }
        return (
          <Space size="small" direction="vertical">
            {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </Space>
        );
      },
      width: isSmallScreen ? 40 : 80,
    },
    ...(isSmallScreen ? [] : [{
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 80,
    }]),
    {
      title: '操作',
      key: 'action',
      width: isSmallScreen ? 40 : 80,
      render: (_: any, record: Document) => (
        <Space 
          direction="vertical"
          size="small"
          style={{ gap: isSmallScreen ? '4px' : undefined }}
        >
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleOpenDetail(record)}
          >
            查看
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => { setEditingDoc(record); setIsFormModalOpen(true); }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该文档？"
            onConfirm={() => { deleteDocument(record.id); message.success('文档已删除'); }}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="文档中心" className="card-container">
      {/* 搜索与操作区 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12} lg={8}>
          <Search
            placeholder="搜索标题或标签"
            allowClear
            enterButton={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: '100%' }}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
          >
            <Option value={DocumentStatus.DRAFT}>{DocumentStatus.DRAFT}</Option>
            <Option value={DocumentStatus.PUBLISHED}>{DocumentStatus.PUBLISHED}</Option>
            <Option value={DocumentStatus.ARCHIVED}>{DocumentStatus.ARCHIVED}</Option>
          </Select>
        </Col>
        <Col xs={12} md={6} lg={12} style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingDoc(null); setIsFormModalOpen(true); }}
          >
            新建文档
          </Button>
        </Col>
      </Row>

      {/* 文档表格 */}
      <Table
        columns={columns}
        dataSource={filteredDocs}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredDocs.length,
          onChange: (p, s) => { setCurrentPage(p); setPageSize(s); },
        }}
        locale={{ emptyText: '暂无文档，点击"新建文档"开始创建' }}
        scroll={{ x: isSmallScreen ? 'max-content' : '100%' }}
      />

      {/* 新建/编辑文档弹窗 */}
      <DocumentFormModal
        visible={isFormModalOpen}
        document={editingDoc}
        onClose={() => setIsFormModalOpen(false)}
      />

      {/* 文档详情弹窗 */}
      {isDetailModalOpen && currentDoc && (
        <DocumentDetailModal
          visible={isDetailModalOpen}
          document={currentDoc}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
      
    </Card>
  );
};

export default DocumentPage;