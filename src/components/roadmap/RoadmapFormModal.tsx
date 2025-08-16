import { useState, useEffect } from 'react';
import moment from 'moment';
import { Modal, Form, Input, Select, DatePicker, Button, Checkbox, message } from 'antd';
const { TextArea } = Input;
import { type RoadmapItem, RoadmapStatus } from '../../types';
import { useRoadmapStore } from '../../store/roadmapStore';
import { useDemandStore } from '../../store/demandStore';
import type { RangePickerProps } from 'antd/es/date-picker';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface RoadmapFormModalProps {
  visible: boolean;
  item?: RoadmapItem | null;
  onClose: () => void;
}

const RoadmapFormModal = ({ visible, item, onClose }: RoadmapFormModalProps) => {
  const [form] = Form.useForm();
  const [selectedDemandIds, setSelectedDemandIds] = useState<string[]>([]);
  const { createRoadmapItem, updateRoadmapItem } = useRoadmapStore();
  const { demands } = useDemandStore(); // 获取所有需求，用于关联选择

  // 初始化表单
  useEffect(() => {
    if (visible) {
      if (visible && item) {
        form.setFieldsValue({
          version: item.version,
          status: item.status,
          timeRange: [
            item.startTime ? moment(item.startTime) : null,  // 转换开始时间
            item.endTime ? moment(item.endTime) : null       // 转换结束时间
          ],
          description: item.description,
          owner: item.owner,
        });
        setSelectedDemandIds(item.demandIds);
      } else if(visible) {
        form.resetFields();
        setSelectedDemandIds([]);
      }
    }
  }, [visible, item, form]);

  // 处理时间范围选择
  const handleTimeRangeChange: RangePickerProps['onChange'] = () => {
    // 时间处理逻辑（可选）
  };

  // 处理需求选择
  const handleDemandChange = (checkedValues: string[]) => {
    setSelectedDemandIds(checkedValues);
  };

  // 表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const [startTime, endTime] = values.timeRange || [];
        const formData = {
          ...values,
          startTime: startTime?.format('YYYY-MM-DD') || '',
          endTime: endTime?.format('YYYY-MM-DD') || '',
          demandIds: selectedDemandIds,
        };
        // 移除timeRange（表单中用，数据中存startTime/endTime）
        delete formData.timeRange;

        if (item) {
          updateRoadmapItem(item.id, formData);
          message.success('版本规划已更新');
        } else {
          createRoadmapItem(formData as Omit<RoadmapItem, 'id'>);
          message.success('版本规划已创建');
        }
        onClose();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={item ? '编辑版本规划' : '新增版本规划'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>确定</Button>,
      ]}
      width={800}
      styles={{ 
        body: { maxHeight: '60vh', overflowY: 'auto' }
      }}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: RoadmapStatus.PLANNING,
          owner: '产品经理A',
        }}
      >
        <Form.Item
          name="version"
          label="版本号"
          rules={[{ required: true, message: '请输入版本号（如V2.3）' }]}
        >
          <Input placeholder="例如：V2.3、V3.0" />
        </Form.Item>

        <Form.Item
          name="status"
          label="版本状态"
          rules={[{ required: true, message: '请选择版本状态' }]}
        >
          <Select>
            <Option value={RoadmapStatus.PLANNING}>{RoadmapStatus.PLANNING}</Option>
            <Option value={RoadmapStatus.DEVELOPING}>{RoadmapStatus.DEVELOPING}</Option>
            <Option value={RoadmapStatus.COMPLETED}>{RoadmapStatus.COMPLETED}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="timeRange"
          label="时间范围"
          rules={[{ required: true, message: '请选择开始和结束时间' }]}
        >
          <RangePicker style={{ width: '100%' }} onChange={handleTimeRangeChange} />
        </Form.Item>

        <Form.Item
          name="owner"
          label="负责人"
          rules={[{ required: true, message: '请输入负责人' }]}
        >
          <Input placeholder="版本负责人姓名" />
        </Form.Item>

        <Form.Item
          name="description"
          label="版本描述"
          rules={[{ required: true, message: '请输入版本目标和主要功能' }]}
        >
          <TextArea rows={3} placeholder="描述该版本的核心目标、包含的主要功能等" />
        </Form.Item>

        <Form.Item
          label="关联需求"
          tooltip="选择该版本需要包含的需求（从需求库中选取）"
        >
          <Checkbox.Group 
            options={demands.map(d => ({ 
              label: d.title, 
              value: d.id 
            }))}
            value={selectedDemandIds}
            onChange={handleDemandChange}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          />
          {demands.length === 0 && (
            <p style={{ color: '#888', marginTop: 8 }}>
              暂无需求可关联，请先在"需求管理"中创建需求
            </p>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoadmapFormModal;