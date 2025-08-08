import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Table, Modal, Input, Select, message, Tag, Tooltip, Popconfirm, Tabs } from 'antd';
import { CopyOutlined, EyeOutlined, DeleteOutlined, ShareAltOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { SavedConfig } from '../types/designer';
import FormDesigner from './FormDesigner';
import type { FormConfig } from '../types/form';

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
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SavedConfig | null>(null);
  const [publishName, setPublishName] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SavedConfig | null>(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveName, setSaveName] = useState('');

  /**
   * 加载已发布的表单列表
   */
  useEffect(() => {
    loadPublishedForms();
    loadSavedConfigs();
  }, []);

  /**
   * 从localStorage加载已发布的表单
   */
  const loadPublishedForms = () => {
    const published = JSON.parse(localStorage.getItem('publishedForms') || '[]');
    setPublishedForms(published);
  };

  /**
   * 从localStorage加载已保存的配置
   */
  const loadSavedConfigs = () => {
    const configs = JSON.parse(localStorage.getItem('formConfigs') || '[]');
    setSavedConfigs(configs);
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
    // 查看表单：跳转到预览模式
    window.open(`${window.location.origin}/form/${form.id}?preview=true`, '_blank');
  };

  /**
   * 填写表单
   */
  const handleFillForm = (form: PublishedForm) => {
    // 填写表单：跳转到正常填写模式
    window.open(`${window.location.origin}/form/${form.id}`, '_blank');
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

  /**
   * 编辑配置
   */
  const handleEditConfig = (config: SavedConfig) => {
    setEditingConfig(config);
    setSaveName(config.name); // 预填充配置名称
    setEditModalVisible(true);
  };

  /**
   * 保存编辑后的配置
   */
  const handleSaveConfig = () => {
    if (!saveName.trim()) {
      message.error('请输入配置名称');
      return;
    }

    try {
      if (editingConfig) {
        // 更新现有配置，而不是新建
        const updatedConfigs = savedConfigs.map(config => {
          if (config.id === editingConfig.id) {
            return {
              ...config,
              name: saveName,
              config: editingConfig.config,
              updateTime: new Date().toISOString(),
            };
          }
          return config;
        });
        
        localStorage.setItem('formConfigs', JSON.stringify(updatedConfigs));
        setSavedConfigs(updatedConfigs);
        
        setSaveModalVisible(false);
        setSaveName('');
        setEditModalVisible(false);
        setEditingConfig(null);
        message.success('配置更新成功！');
      }
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  /**
   * 处理配置更新
   */
  const handleConfigUpdate = (updatedConfig: FormConfig) => {
    if (editingConfig) {
      setEditingConfig({
        ...editingConfig,
        config: {
          title: updatedConfig.title,
          fields: updatedConfig.fields, // 保留完整的字段信息，包括id
          layout: (updatedConfig.layout as 'horizontal' | 'vertical' | 'inline') || 'vertical',
          responsive: updatedConfig.responsive !== undefined ? updatedConfig.responsive : true,
        },
      });
    }
  };

  /**
   * 删除配置
   */
  const handleDeleteConfig = (configId: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== configId);
    localStorage.setItem('formConfigs', JSON.stringify(updatedConfigs));
    setSavedConfigs(updatedConfigs);
    message.success('配置已删除');
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
          <Tooltip title="填写表单">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleFillForm(record)}
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

  // 已保存配置列表的表格列配置
  const configColumns = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: SavedConfig) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.config.title}</div>
          <div style={{ fontSize: '11px', color: '#ccc' }}>ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '字段数量',
      key: 'fieldCount',
      render: (_: any, record: SavedConfig) => (
        <Tag color="blue">{record.config.fields.length}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: SavedConfig) => (
        <Space size="small">
          <Tooltip title="发布表单">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedConfig(record);
                setPublishModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="编辑配置">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditConfig(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个配置吗？"
            onConfirm={() => handleDeleteConfig(record.id)}
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
      <Tabs
        items={[
          {
            key: 'published',
            label: '已发布表单',
            children: (
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
            ),
          },
          {
            key: 'configs',
            label: '已保存配置',
            children: (
              <Card title="表单配置管理">
                <Table
                  columns={configColumns}
                  dataSource={savedConfigs}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Card>
            ),
          },
        ]}
      />

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

      {/* 编辑配置弹窗 */}
      <Modal
        title={`编辑配置 - ${editingConfig?.name || ''}`}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingConfig(null);
          setSaveName('');
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setEditModalVisible(false);
            setEditingConfig(null);
            setSaveName('');
          }}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={() => setSaveModalVisible(true)}>
            保存
          </Button>
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
      >
        {editingConfig && (
          <>
            <div style={{ marginBottom: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px', border: '1px solid #d6e4ff' }}>
              <div style={{ fontWeight: 500, marginBottom: 8, color: '#1890ff' }}>配置信息</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                <div>配置名称：{editingConfig.name}</div>
                <div>表单标题：{editingConfig.config.title}</div>
                <div>字段数量：{editingConfig.config.fields.length}</div>
                <div>创建时间：{new Date(editingConfig.createTime).toLocaleString()}</div>
                <div>更新时间：{new Date(editingConfig.updateTime).toLocaleString()}</div>
              </div>
            </div>
            <FormDesigner 
              initialConfig={{
                title: editingConfig.config.title,
                fields: editingConfig.config.fields, // 直接使用原始字段，包含id
                layout: editingConfig.config.layout,
                responsive: editingConfig.config.responsive,
              }}
              onConfigUpdate={handleConfigUpdate}
              isEditMode={true}
            />
          </>
        )}
      </Modal>

      {/* 保存配置弹窗 */}
      <Modal
        title="更新配置"
        open={saveModalVisible}
        onOk={handleSaveConfig}
        onCancel={() => {
          setSaveModalVisible(false);
          setSaveName('');
        }}
        okText="更新"
        cancelText="取消"
      >
        <div>
          <div style={{ marginBottom: 8 }}>配置名称：</div>
          <Input
            placeholder="请输入配置名称"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
          {editingConfig && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', color: '#666' }}>
              <div>原配置名称：{editingConfig.name}</div>
              <div>表单标题：{editingConfig.config.title}</div>
              <div>字段数量：{editingConfig.config.fields.length}</div>
              <div>创建时间：{new Date(editingConfig.createTime).toLocaleString()}</div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FormPublisher; 