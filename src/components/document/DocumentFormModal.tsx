import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Tag, Space, Button, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { type Document, DocumentStatus } from '../../types';
import { useDocumentStore } from '../../store/documentStore';
import { useDemandStore } from '../../store/demandStore';

const { Option } = Select;

interface DocumentFormModalProps {
  visible: boolean;
  document?: Document | null;
  onClose: () => void;
}

const DocumentFormModal = ({ visible, document, onClose }: DocumentFormModalProps) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { createDocument, updateDocument } = useDocumentStore();
  const { demands } = useDemandStore(); // 需求列表（用于关联选择）

  // 初始化表单
  useEffect(() => {
    if (visible && document) {
      form.setFieldsValue({
        title: document.title,
        status: document.status,
        demandId: document.demandId,
      });
      setContent(document.content);
      setTags(document.tags);
    } else if (visible) {
      form.resetFields();
      setContent('');
      setTags([]);
    }
  }, [visible, document, form]);

  // 标签操作
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const docData = {
          ...values,
          content,
          tags,
        };
        if (document) {
          updateDocument(document.id, docData);
          message.success('文档已更新');
        } else {
          createDocument(docData as any);
          message.success('文档已创建');
        }
        onClose();
      })
      .catch(info => console.log('Validate failed:', info));
  };

  return (
    <Modal
      title={document ? '编辑文档' : '新建文档'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>保存</Button>,
      ]}
      width={900}
      styles={{ 
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <Form form={form} layout="vertical" initialValues={{ status: DocumentStatus.DRAFT }}>
        <Form.Item
          name="title"
          label="文档标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="例如：用户注册功能PRD" />
        </Form.Item>

        <Form.Item
          name="demandId"
          label="关联需求"
        >
          <Select placeholder="选择关联的需求（可选）">
            {demands.map(demand => (
              <Option key={demand.id} value={demand.id}>
                {demand.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="标签">
          <Space size="small" style={{ marginBottom: 8 }}>
            {tags.map(tag => (
              <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                {tag}
              </Tag>
            ))}
          </Space>
          <Input
            placeholder="输入标签按回车添加"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onPressEnter={handleAddTag}
            style={{ width: 200 }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value={DocumentStatus.DRAFT}>{DocumentStatus.DRAFT}</Option>
            <Option value={DocumentStatus.PUBLISHED}>{DocumentStatus.PUBLISHED}</Option>
            <Option value={DocumentStatus.ARCHIVED}>{DocumentStatus.ARCHIVED}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="文档内容"
          rules={[{ required: true, message: '请输入文档内容' }]}
        >
          <Editor
            apiKey="646lf6l5gzk2jlzrzmd1uzsnk40v75th5n9c6xlli0gj0cvh" // 去官网申请免费key
            value={content}
            onEditorChange={setContent}
            init={{
              height: 400,
              menubar: true,
              plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
              toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentFormModal;