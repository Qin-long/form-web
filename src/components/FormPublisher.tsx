import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Table, Modal, Input, Select, message, Tag, Tooltip, Popconfirm } from 'antd';
import { CopyOutlined, EyeOutlined, DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';
import type { SavedConfig } from '../types/designer';

/**
 * 已发布表单的数据结构
 */
interface PublishedForm {
  id: string;
  configId: string;
  name: string;
  title: string;
  config: any;
  publishTime: string;
  accessCount: number;
  submitCount: number;
  isActive: boolean;
  shareUrl: string;
}

/**
 * 表单发布页面组件
 * 用于管理已发布的表单，包括发布、查看、分享、删除等功能
 */
const FormPublisher: React.FC = () => {
  const [publishedForms, setPublishedForms] = useState<PublishedForm[]>([]);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SavedConfig | null>(null);
  const [publishName, setPublishName] = useState('');

  /**
   * 加载已发布的表单列表
   */
  useEffect(() => {
    loadPublishedForms();
  }, []);

  /**
   * 从localStorage加载已发布的表单
   */
  const loadPublishedForms = () => {
    const published = JSON.parse(localStorage.getItem('publishedForms') || '[]');
    setPublishedForms(published);
  };

  /**
   * 发布表单
   */
  const handlePublish = () => {
    if (!publishName.trim()) {
      message.error('请输入发布名称');
      return;
    }

    if (!selectedConfig) {
      message.error('请选择要发布的配置');
      return;
    }

    const formId = `published_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const publishedForm: PublishedForm = {
      id: formId,
      configId: selectedConfig.id,
      name: publishName,
      title: selectedConfig.config.title,
      config: selectedConfig.config,
      publishTime: new Date().toISOString(),
      accessCount: 0,
      submitCount: 0,
      isActive: true,
      shareUrl: `${window.location.origin}/form/${formId}`,
    };

    const updatedForms = [...publishedForms, publishedForm];
    localStorage.setItem('publishedForms', JSON.stringify(updatedForms));
    setPublishedForms(updatedForms);
    
    setPublishModalVisible(false);
    setPublishName('');
    setSelectedConfig(null);
    message.success('表单发布成功！');
  };

  /**
   * 复制分享链接
   */
  const handleCopyUrl = (form: PublishedForm) => {
    navigator.clipboard.writeText(form.shareUrl).then(() => {
      message.success('链接已复制到剪贴板');
    });
  };

  /**
   * 查看表单
   */
  const handleViewForm = (form: PublishedForm) => {
    window.open(form.shareUrl, '_blank');
  };

  /**
   * 删除已发布的表单
   */
  const handleDeleteForm = (formId: string) => {
    const updatedForms = publishedForms.filter(form => form.id !== formId);
    localStorage.setItem('publishedForms', JSON.stringify(updatedForms));
    setPublishedForms(updatedForms);
    message.success('表单已删除');
  };

  /**
   * 获取可发布的配置列表
   */
  const getAvailableConfigs = (): SavedConfig[] => {
    return JSON.parse(localStorage.getItem('formConfigs') || '[]');
  };

  // 表格列配置
  const columns = [
    {
      title: '表单名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PublishedForm) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.title}</div>
        </div>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '访问次数',
      dataIndex: 'accessCount',
      key: 'accessCount',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: '提交次数',
      dataIndex: 'submitCount',
      key: 'submitCount',
      render: (count: number) => <Tag color="green">{count}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '已发布' : '已下线'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: PublishedForm) => (
        <Space size="small">
          <Tooltip title="查看表单">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewForm(record)}
            />
          </Tooltip>
          <Tooltip title="复制链接">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyUrl(record)}
            />
          </Tooltip>
          <Tooltip title="分享">
            <Button
              type="text"
              size="small"
              icon={<ShareAltOutlined />}
              onClick={() => handleCopyUrl(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个已发布的表单吗？"
            onConfirm={() => handleDeleteForm(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title="表单发布管理"
        extra={
          <Button
            type="primary"
            onClick={() => setPublishModalVisible(true)}
          >
            发布新表单
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={publishedForms}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* 发布表单弹窗 */}
      <Modal
        title="发布表单"
        open={publishModalVisible}
        onOk={handlePublish}
        onCancel={() => {
          setPublishModalVisible(false);
          setPublishName('');
          setSelectedConfig(null);
        }}
        okText="发布"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>选择配置：</div>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择要发布的表单配置"
            value={selectedConfig?.id}
            onChange={(value) => {
              const config = getAvailableConfigs().find(c => c.id === value);
              setSelectedConfig(config || null);
            }}
            options={getAvailableConfigs().map(config => ({
              label: config.name,
              value: config.id,
            }))}
          />
        </div>
        <div>
          <div style={{ marginBottom: 8 }}>发布名称：</div>
          <Input
            placeholder="请输入发布名称"
            value={publishName}
            onChange={(e) => setPublishName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default FormPublisher; 