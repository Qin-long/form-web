import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Space, message } from 'antd';
import type { FormConfig, FormData, ValidationResult } from '../types/form';
import FormField from './FormField';
import { createZodSchema } from '../utils/validation';

interface DynamicFormProps {
  config: FormConfig;
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
  initialValues?: FormData;
  loading?: boolean;
}

// 与DesignCanvas保持一致的常量
const CANVAS_MAX_WIDTH = 960;

// 动态生成AntD rules
function getAntdRules(field: any) {
  const rules = [];
  // 必填
  if (field.validation?.required) {
    rules.push({ required: true, message: field.validation?.message || `${field.label}为必填项` });
  }
  // 常用校验
  if (field.validation?.custom && field.validation?.pattern) {
    rules.push({
      pattern: new RegExp(field.validation.pattern),
      message: field.validation?.message || '格式不正确',
    });
  }
  // 最小长度
  if (!field.validation?.custom && field.validation?.min) {
    rules.push({
      min: field.validation.min,
      message: field.validation?.message || `最少${field.validation.min}个字符`,
    });
  }
  // 最大长度
  if (!field.validation?.custom && field.validation?.max) {
    rules.push({
      max: field.validation.max,
      message: field.validation?.message || `最多${field.validation.max}个字符`,
    });
  }
  return rules;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
  onCancel,
  initialValues = {},
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const defaultValues: FormData = {};
    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      }
    });
    const mergedValues = { ...defaultValues, ...initialValues };
    form.setFieldsValue(mergedValues);
    // 只依赖字段名和初始值，避免死循环
  }, [config.fields.map(f => f.name).join(','), JSON.stringify(initialValues)]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (onSubmit) onSubmit(values);
      else message.success('表单提交成功！');
    } catch (err) {
      message.error('请检查表单填写是否正确');
    }
  };

  const handleReset = () => {
    form.resetFields();
    setErrors({});
  };

  return (
    <Card title={config.title} style={{ maxWidth: CANVAS_MAX_WIDTH, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        {/* 使用与DesignCanvas相同的栅格布局容器 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            maxWidth: CANVAS_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          {config.fields.map((field) => {
            const span = field.span || 24;
            const colPercent = Math.max(1, Math.min(span, 24)) / 24 * 100;
            
            return (
              <div
                key={field.name}
                style={{
                  flex: `0 0 ${colPercent}%`,
                  width: `${colPercent}%`,
                  minWidth: '120px',
                  minHeight: '48px',
                  boxSizing: 'border-box',
                  padding: '0 8px 16px 8px', // 添加一些间距用于表单项
                }}
              >
                <Form.Item
                  label={field.label}
                  name={field.name}
                  required={field.validation?.required}
                  style={{ marginBottom: 0 }}
                  rules={getAntdRules(field)}
                  validateTrigger={field.validation?.trigger || 'onBlur'}
                >
                  <FormField
                    field={field}
                  />
                </Form.Item>
              </div>
            );
          })}
        </div>

        <Form.Item style={{ marginTop: 24, textAlign: 'center' }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
            <Button onClick={handleReset}>重置</Button>
            {onCancel && (
              <Button onClick={onCancel}>取消</Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DynamicForm; 