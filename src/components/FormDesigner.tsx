import React, { useState, useCallback } from 'react';
import { Layout, Button, Space, Modal, Input, message, Tabs } from 'antd';
import { SaveOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import ComponentPanel from './ComponentPanel';
import DesignCanvas from './DesignCanvas';
import PropertyPanel from './PropertyPanel';
import DynamicForm from './DynamicForm';
import type { DesignerField, SavedConfig } from '../types/designer';
import type { ComponentItem } from '../types/designer';

const { Sider, Content } = Layout;

const FormDesigner: React.FC = () => {
  const [fields, setFields] = useState<DesignerField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('我的表单');
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [configName, setConfigName] = useState('');

  const selectedField = fields.find(field => field.id === selectedFieldId) || null;

  // 生成唯一ID
  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 处理组件拖拽
  const handleDrop = useCallback((component: ComponentItem) => {
    const newField: DesignerField = {
      id: generateId(),
      ...component.defaultConfig,
      width: component.defaultConfig.width || 300,
      height: component.defaultConfig.height || 32,
    };
    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  }, []);

  // 选择字段
  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
  };

  // 更新字段
  const handleFieldUpdate = (fieldId: string, updates: Partial<DesignerField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  // 删除字段
  const handleFieldDelete = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  // 排序字段
  const handleSort = (fromIndex: number, toIndex: number) => {
    setFields(prev => {
      const newFields = [...prev];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return newFields;
    });
  };

  // 判断是否为预设选项类型
  const isPresetOptions = (field: any) => {
    return field.optionsPreset && typeof field.optionsPreset === 'string';
  };

  // 保存配置
  const handleSave = () => {
    if (!configName.trim()) {
      message.error('请输入配置名称');
      return;
    }

    const config: SavedConfig = {
      id: generateId(),
      name: configName,
      config: {
        title: formTitle,
        fields: fields.map(({ id, ...field }) => {
          // 只保存optionsPreset，不保存options字段
          if ('optionsPreset' in field) {
            const { options, ...rest } = field;
            return { ...rest };
          }
          return field;
        }),
        layout: 'vertical',
        responsive: true,
      },
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    // 保存到 localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('formConfigs') || '[]');
    savedConfigs.push(config);
    localStorage.setItem('formConfigs', JSON.stringify(savedConfigs));

    message.success('配置保存成功！');
    setSaveModalVisible(false);
    setConfigName('');
  };

  // 导出配置
  const handleExport = () => {
    const config = {
      title: formTitle,
      fields: fields.map(({ id, ...field }) => {
        if ('optionsPreset' in field) {
          const { options, ...rest } = field;
          return { ...rest };
        }
        return field;
      }),
      layout: 'vertical',
      responsive: true,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formTitle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success('配置导出成功！');
  };

  // 导入配置
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            setFormTitle(config.title || '导入的表单');
            setFields(config.fields.map((field: any) => ({
              ...field,
              id: generateId(),
              width: field.width || 300,
              height: field.height || 32,
            })));
            message.success('配置导入成功！');
          } catch (error) {
            message.error('配置文件格式错误！');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const items = [
    {
      key: 'design',
      label: '设计',
      children: (
        <Layout style={{ height: 'calc(100vh - 120px)' }}>
          <Sider width={280} style={{ background: '#fff', padding: '16px', overflow: 'auto' }}>
            <ComponentPanel onDragStart={() => {}} />
          </Sider>
          <Content style={{ padding: '16px', background: '#fff', overflow: 'auto' }}>
            <DesignCanvas
              fields={fields}
              selectedFieldId={selectedFieldId}
              onFieldSelect={handleFieldSelect}
              onFieldUpdate={handleFieldUpdate}
              onFieldDelete={handleFieldDelete}
              onDrop={handleDrop}
              onSort={handleSort}
            />
          </Content>
          <Sider width={300} style={{ background: '#fff', padding: '16px', overflow: 'auto' }}>
            <PropertyPanel
              selectedField={selectedField}
              onFieldUpdate={handleFieldUpdate}
            />
          </Sider>
        </Layout>
      ),
    },
    {
      key: 'preview',
      label: '预览',
      children: (
        <div style={{ padding: '20px' }}>
          <DynamicForm
            config={{
              title: formTitle,
              fields: fields.map(({ id, ...field }) => ({ ...field, id })),
              layout: 'vertical',
              responsive: true,
            }}
            onSubmit={(data) => {
              message.success('表单提交成功！');
              console.log('表单数据:', data);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <div style={{ 
        padding: '12px 20px', 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="表单标题"
            style={{ width: 200 }}
          />
        </div>
        <Space>
          <Button icon={<SaveOutlined />} onClick={() => setSaveModalVisible(true)}>
            保存配置
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出配置
          </Button>
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            导入配置
          </Button>
        </Space>
      </div>

      {/* 主内容区 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Tabs
          items={items}
          style={{ height: '100%' }}
          tabBarStyle={{ margin: 0, padding: '0 20px' }}
        />
      </div>

      {/* 保存配置弹窗 */}
      <Modal
        title="保存配置"
        open={saveModalVisible}
        onOk={handleSave}
        onCancel={() => setSaveModalVisible(false)}
      >
        <Input
          placeholder="请输入配置名称"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default FormDesigner; 