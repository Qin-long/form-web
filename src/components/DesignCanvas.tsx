import React, { useRef, useState } from 'react';
import { Card, Empty, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import FormField from './FormField';
import type { DesignerField } from '../types/designer';

interface DesignCanvasProps {
  fields: DesignerField[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<DesignerField>) => void;
  onFieldDelete: (fieldId: string) => void;
  onDrop: (component: any) => void;
  onSort: (fromIndex: number, toIndex: number) => void;
}

const CANVAS_MAX_WIDTH = 960;
const GRID_COLUMNS = 24;
const COLUMN_WIDTH = CANVAS_MAX_WIDTH / GRID_COLUMNS;

const DesignCanvas: React.FC<DesignCanvasProps> = ({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldUpdate,
  onFieldDelete,
  onDrop,
  onSort,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragFieldIndex = useRef<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('application/json');
    if (componentData) {
      const component = JSON.parse(componentData);
      onDrop(component);
    }
    setDragOverIndex(null);
    dragFieldIndex.current = null;
  };

  const handleFieldClick = (fieldId: string) => {
    onFieldSelect(fieldId);
  };

  const handleFieldDelete = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    onFieldDelete(fieldId);
  };

  // 拖拽排序相关
  const handleFieldDragStart = (index: number) => {
    dragFieldIndex.current = index;
  };
  const handleFieldDragOver = (index: number) => {
    setDragOverIndex(index);
  };
  const handleFieldDrop = (index: number) => {
    if (dragFieldIndex.current !== null && dragFieldIndex.current !== index) {
      onSort(dragFieldIndex.current, index);
    }
    setDragOverIndex(null);
    dragFieldIndex.current = null;
  };
  const handleFieldDragEnd = () => {
    setDragOverIndex(null);
    dragFieldIndex.current = null;
  };

  // 生成栅格背景
  const generateGridBackground = () => {
    const gridLines = [];
    // 垂直线
    for (let i = 1; i < GRID_COLUMNS; i++) {
      const left = (i / GRID_COLUMNS) * 100;
      gridLines.push(
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: '#e8e8e8',
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      );
    }
    return gridLines;
  };

  return (
    <Card 
      title="设计画布" 
      size="small"
      style={{ flex: 1, minHeight: '600px', position: 'relative', background: '#fafbfc', border: 'none' }}
    >
      <div
        style={{
          minHeight: '500px',
          border: '2px dashed #d9d9d9',
          borderRadius: '10px',
          padding: '32px 0',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          maxWidth: CANVAS_MAX_WIDTH,
          margin: '0 auto',
          position: 'relative',
          // 添加栅格背景样式
          backgroundImage: `
            linear-gradient(to right, #e8e8e8 1px, transparent 1px),
            linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)
          `,
          backgroundSize: `${COLUMN_WIDTH}px 40px`,
          backgroundPosition: '32px 32px',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* 栅格线条 */}
        {generateGridBackground()}
        
        {fields.length === 0 ? (
          <Empty
            description="拖拽组件到此处开始设计表单"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ zIndex: 2, position: 'relative' }}
          />
        ) : (
          fields.map((field, idx) => {
            const span = field.span || 24;
            const colPercent = Math.max(1, Math.min(span, 24)) / 24 * 100;
            return (
              <div
                key={field.id}
                draggable
                onDragStart={() => handleFieldDragStart(idx)}
                onDragOver={e => { e.preventDefault(); handleFieldDragOver(idx); }}
                onDrop={() => handleFieldDrop(idx)}
                onDragEnd={handleFieldDragEnd}
                style={{
                  flex: `0 0 ${colPercent}%`,
                  width: `${colPercent}%`,
                  minWidth: '120px',
                  minHeight: '48px',
                  boxSizing: 'border-box',
                  border: selectedFieldId === field.id ? '2px solid #1890ff' : dragOverIndex === idx ? '2px dashed #52c41a' : '1px solid #e4e7ed',
                  borderRadius: '8px',
                  background: '#fff',
                  boxShadow: selectedFieldId === field.id ? '0 2px 12px rgba(24,144,255,0.08)' : dragOverIndex === idx ? '0 2px 12px rgba(82,196,26,0.08)' : '0 1px 4px rgba(0,0,0,0.03)',
                  padding: '12px 16px 8px 16px',
                  cursor: 'move',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  marginBottom: 0,
                  transition: 'border 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  zIndex: 2,
                }}
                onClick={() => handleFieldClick(field.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>
                    {field.label} (span: {span})
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => handleFieldDelete(e, field.id)}
                    style={{ padding: '0 4px' }}
                  />
                </div>
                <div style={{ width: '100%', flex: 1 }}>
                  <FormField
                    field={field}
                    value=""
                    onChange={() => {}}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default DesignCanvas; 