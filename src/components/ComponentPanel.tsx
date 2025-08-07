import React from 'react';
import { Card, Tabs, List, Avatar, Space } from 'antd';
import { componentLibrary, getComponentsByCategory } from '../data/componentLibrary';
import type { ComponentItem } from '../types/designer';

interface ComponentPanelProps {
  onDragStart: (component: ComponentItem) => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({ onDragStart }) => {
  const basicComponents = getComponentsByCategory('basic');
  const advancedComponents = getComponentsByCategory('advanced');

  const handleDragStart = (e: React.DragEvent, component: ComponentItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onDragStart(component);
  };

  const renderComponentList = (components: ComponentItem[]) => (
    <List
      size="small"
      dataSource={components}
      renderItem={(component) => (
        <List.Item
          draggable
          onDragStart={(e) => handleDragStart(e, component)}
          style={{
            cursor: 'grab',
            padding: '8px 12px',
            border: '1px solid #f0f0f0',
            borderRadius: '6px',
            marginBottom: '8px',
            backgroundColor: '#fff',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <List.Item.Meta
            avatar={<Avatar size="small">{component.icon}</Avatar>}
            title={component.name}
            description={`类型: ${component.type}`}
          />
        </List.Item>
      )}
    />
  );

  const items = [
    {
      key: 'basic',
      label: '基础组件',
      children: (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {renderComponentList(basicComponents)}
        </div>
      ),
    },
    {
      key: 'advanced',
      label: '高级组件',
      children: (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {renderComponentList(advancedComponents)}
        </div>
      ),
    },
  ];

  return (
    <Card title="组件库" size="small" style={{ width: 280 }}>
      <Tabs
        items={items}
        size="small"
        tabBarStyle={{ marginBottom: 12 }}
      />
    </Card>
  );
};

export default ComponentPanel; 