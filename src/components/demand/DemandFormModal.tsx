import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Tag, Space, Button } from 'antd';
const { TextArea } = Input;
import { type Demand, DemandStatus } from '../../types';
import { useDemandStore } from '../../store/demandStore';

const { Option } = Select;

interface DemandFormModalProps {
  visible: boolean;
  demand?: Demand | null;
  onClose: () => void;
}

const DemandFormModal = ({ visible, demand, onClose }: DemandFormModalProps) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { createDemand, updateDemand } = useDemandStore();

  // 初始化表单（编辑时）
  useEffect(() => {
    if (visible) {
      if (demand) {
        form.setFieldsValue({
          title: demand.title,
          description: demand.description,
          status: demand.status,
          riceParams: demand.riceParams,
        });
        setTags(demand.tags);
      } else {
        // 新增时重置表单
        form.resetFields();
        setTags([]);
      }
    }

  }, [visible, demand, form]);

  // 处理标签添加
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  // 处理标签删除
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const formData = {
          ...values,
          tags,
        };
        if (demand) {
          // 编辑需求
          updateDemand(demand.id, formData);
        } else {
          // 新增需求（默认状态为“待评审”）
          createDemand({ ...formData, status: DemandStatus.PENDING });
        }
        onClose();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={demand ? '编辑需求' : '新增需求'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>确定</Button>,
      ]}
      width={700}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: DemandStatus.PENDING,
          riceParams: { reach: 1000, impact: 3, confidence: 80, effort: 2 },
        }}
      >
        {/* 基本信息 */}
        <Form.Item
          name="title"
          label="需求标题"
          rules={[{ required: true, message: '请输入需求标题' }]}
        >
          <Input placeholder="请输入需求标题（简洁明了）" />
        </Form.Item>

        <Form.Item
          name="description"
          label="需求描述"
          rules={[{ required: true, message: '请输入需求描述' }]}
        >
          <TextArea rows={4} placeholder="请详细描述需求背景、目标和具体场景" />
        </Form.Item>

        {/* 标签 */}
        <Form.Item label="标签">
          <div>
            <Space size="small" style={{ marginBottom: 8 }}>
              {tags.map(tag => (
                <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </Space>
            <Input
              placeholder="输入标签后按回车添加"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={handleAddTag}
              style={{ width: 200 }}
            />
          </div>
        </Form.Item>

        {/* 状态（编辑时可见） */}
        {demand && (
          <Form.Item
            name="status"
            label="需求状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择需求状态">
              <Option value={DemandStatus.PENDING}>{DemandStatus.PENDING}</Option>
              <Option value={DemandStatus.DEVELOPING}>{DemandStatus.DEVELOPING}</Option>
              <Option value={DemandStatus.TESTING}>{DemandStatus.TESTING}</Option>
              <Option value={DemandStatus.ONLINE}>{DemandStatus.ONLINE}</Option>
              <Option value={DemandStatus.REJECTED}>{DemandStatus.REJECTED}</Option>
            </Select>
          </Form.Item>
        )}

        {/* RICE模型参数 */}
        <Form.Item label="RICE模型参数（用于计算优先级）">
          <Form.Item
            name={['riceParams', 'reach']}
            rules={[{ required: true, message: '请输入影响用户数' }]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              placeholder="影响用户数（Reach）"
              min={1}
              style={{ width: '100%' }}
              addonAfter="人"
            />
          </Form.Item>

          <Form.Item
            name={['riceParams', 'impact']}
            rules={[{ required: true, message: '请选择影响程度' }]}
            style={{ marginBottom: 16 }}
          >
            <Select placeholder="影响程度（Impact，1-5分）">
              <Option value={1}>1（微小）</Option>
              <Option value={2}>2（较小）</Option>
              <Option value={3}>3（中等）</Option>
              <Option value={4}>4（较大）</Option>
              <Option value={5}>5（重大）</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['riceParams', 'confidence']}
            rules={[{ required: true, message: '请输入置信度' }]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              placeholder="置信度（Confidence）"
              min={0}
              max={100}
              style={{ width: '100%' }}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item
            name={['riceParams', 'effort']}
            rules={[{ required: true, message: '请输入开发成本' }]}
          >
            <InputNumber
              placeholder="开发成本（Effort，人天）"
              min={0.5}
              step={0.5}
              style={{ width: '100%' }}
              addonAfter="人天"
            />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DemandFormModal;