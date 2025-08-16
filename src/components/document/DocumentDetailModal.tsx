import { Modal, Card, Tag, Space, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { type Document, DocumentStatus } from '../../types';
import { useDemandStore } from '../../store/demandStore';

interface DocumentDetailModalProps {
  visible: boolean;
  document?: Document | null;
  onClose: () => void;
  onEdit?: (doc: Document) => void;
}

const DocumentDetailModal = ({ visible, document, onClose, onEdit }: DocumentDetailModalProps) => {
  if (!document || !document.id) return null;

  const { demands } = useDemandStore();
  const demand = demands.find(d => d.id === document.demandId);

  return (
    <Modal
      title={document.title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button 
          key="edit" 
          type="primary" 
          icon={<EditOutlined />}
          onClick={() => { onEdit?.(document); onClose(); }}
        >
          编辑文档
        </Button>,
      ]}
      width={900}
      styles={{ 
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      {/* 文档元信息 */}
      <Card variant="outlined" style={{ marginBottom: 16 }}>
        <Space size="middle">
          <Tag color={
            document.status === DocumentStatus.PUBLISHED ? 'green' :
            document.status === DocumentStatus.DRAFT ? 'orange' : 'gray'
          }>
            {document.status}
          </Tag>
          <Tag>版本：v{document.version}</Tag>
          {demand && <Tag>关联需求：{demand.title}</Tag>}
          <Tag>创建人：{document.creator}</Tag>
          <Tag>更新于：{document.updatedAt}</Tag>
        </Space>
        {document.tags.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <Space size="small">
              {document.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </Space>
          </div>
        )}
      </Card>

      {/* 文档内容（HTML渲染） */}
      <div 
        className="document-content"
        dangerouslySetInnerHTML={{ __html: document.content || '<p>无文档内容</p>' }}
        style={{ padding: '0 16px' }}
      />
    </Modal>
  );
};

export default DocumentDetailModal;