import React, { useState } from 'react';
import { Tabs, Card, Button, Space, message } from 'antd';
import DynamicForm from './DynamicForm';
import { FormBuilder } from '../utils/formBuilder';
import type { FormConfig, FormData } from '../types/form';

const FormDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('userInfo');
  const [formResults, setFormResults] = useState<Record<string, FormData>>({});

  // 不同的表单配置
  const formConfigs: Record<string, FormConfig> = {
    userInfo: FormBuilder.createUserInfoForm(),
    contact: FormBuilder.createContactForm(),
    simple: new FormBuilder('简单表单')
      .addField('name')
      .addField('phone')
      .addField('email')
      .build(),
    survey: new FormBuilder('问卷调查')
      .addField('name')
      .addField('age')
      .addField('gender')
      .addField('education')
      .addCustomField({
        type: 'radio',
        name: 'satisfaction',
        label: '整体满意度',
        options: [
          { label: '非常满意', value: 'very_satisfied' },
          { label: '满意', value: 'satisfied' },
          { label: '一般', value: 'neutral' },
          { label: '不满意', value: 'dissatisfied' },
          { label: '非常不满意', value: 'very_dissatisfied' },
        ],
        validation: { required: true },
      })
      .addCustomField({
        type: 'checkbox',
        name: 'improvements',
        label: '希望改进的方面',
        options: [
          { label: '产品质量', value: 'product_quality' },
          { label: '服务质量', value: 'service_quality' },
          { label: '价格', value: 'price' },
          { label: '用户体验', value: 'user_experience' },
          { label: '其他', value: 'other' },
        ],
      })
      .addCustomField({
        type: 'textarea',
        name: 'suggestions',
        label: '建议和意见',
        placeholder: '请分享您的建议和意见',
        width: 400,
        height: 4,
      })
      .build(),
  };

  const handleSubmit = (formName: string, data: FormData) => {
    setFormResults(prev => ({
      ...prev,
      [formName]: data,
    }));
    message.success(`${formConfigs[formName].title}提交成功！`);
    console.log(`${formName} 表单数据:`, data);
  };

  const handleCancel = () => {
    message.info('已取消操作');
  };

  const items = Object.entries(formConfigs).map(([key, config]) => ({
    key,
    label: config.title,
    children: (
      <div style={{ padding: '20px 0' }}>
        <DynamicForm
          config={config}
          onSubmit={(data) => handleSubmit(key, data)}
          onCancel={handleCancel}
        />
        
        {formResults[key] && (
          <Card 
            title="提交结果" 
            style={{ marginTop: 20 }}
            extra={
              <Button 
                size="small" 
                onClick={() => {
                  const newResults = { ...formResults };
                  delete newResults[key];
                  setFormResults(newResults);
                }}
              >
                清除
              </Button>
            }
          >
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '6px',
              overflow: 'auto',
              maxHeight: '200px',
              fontSize: '12px'
            }}>
              {JSON.stringify(formResults[key], null, 2)}
            </pre>
          </Card>
        )}
      </div>
    ),
  }));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card title="动态表单生成器演示" style={{ marginBottom: 20 }}>
        <p>
          这个演示展示了如何使用动态表单生成器创建不同类型的表单。
          每个标签页都包含一个不同的表单配置，展示了各种组件类型和校验规则。
        </p>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        type="card"
        size="large"
      />
    </div>
  );
};

export default FormDemo; 