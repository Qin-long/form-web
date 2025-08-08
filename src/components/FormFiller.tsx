import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, message, Result, Spin, Layout, Typography, Space, Modal, Input } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import DynamicForm from './DynamicForm';
import FormDesigner from './FormDesigner';
import type { FormConfig, FormData } from '../types/form';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

/**
 * 表单填写页面组件
 * 独立的表单填写页面，支持PC和移动端自适应
 */
const FormFiller: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formId, setFormId] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [originalFormConfig, setOriginalFormConfig] = useState<FormConfig | null>(null);
  const { formId: routeFormId } = useParams<{ formId: string }>();

  /**
   * 从URL参数获取表单ID并加载表单配置
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || routeFormId || '';
    setFormId(id);
    
    if (id) {
      loadFormConfig(id);
    } else {
      setLoading(false);
    }
  }, [routeFormId]);

  /**
   * 加载表单配置
   */
  const loadFormConfig = (id: string) => {
    try {
      // 从localStorage获取已发布的表单
      const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
      const publishedForm = publishedForms.find((form: any) => 
        form.id === id || form.shareUrl.includes(id)
      );

      if (publishedForm) {
        setFormConfig(publishedForm.config);
        
        // 更新访问次数
        updateAccessCount(publishedForm.id);
      } else {
        message.error('表单不存在或已被删除');
      }
    } catch (error) {
      message.error('加载表单失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新访问次数
   */
  const updateAccessCount = (formId: string) => {
    try {
      const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
      const updatedForms = publishedForms.map((form: any) => {
        if (form.id === formId) {
          return { ...form, accessCount: (form.accessCount || 0) + 1 };
        }
        return form;
      });
      localStorage.setItem('publishedForms', JSON.stringify(updatedForms));
    } catch (error) {
      console.error('更新访问次数失败:', error);
    }
  };

  /**
   * 更新提交次数
   */
  const updateSubmitCount = (formId: string) => {
    try {
      const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
      const updatedForms = publishedForms.map((form: any) => {
        if (form.id === formId) {
          return { ...form, submitCount: (form.submitCount || 0) + 1 };
        }
        return form;
      });
      localStorage.setItem('publishedForms', JSON.stringify(updatedForms));
    } catch (error) {
      console.error('更新提交次数失败:', error);
    }
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = (data: FormData) => {
    try {
      // 保存提交的数据
      const submission = {
        id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        formId,
        formTitle: formConfig?.title || '未知表单',
        data,
        submitTime: new Date().toISOString(),
      };

      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      submissions.push(submission);
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));

      // 更新提交次数
      updateSubmitCount(formId);

      setSubmitted(true);
      message.success('表单提交成功！');
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  /**
   * 重新填写表单
   */
  const handleRefill = () => {
    setSubmitted(false);
  };

  /**
   * 返回上一页
   */
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  /**
   * 进入编辑模式
   */
  const handleEdit = () => {
    if (formConfig) {
      setOriginalFormConfig(formConfig);
      setIsEditMode(true);
      setEditModalVisible(true);
    }
  };

  /**
   * 退出编辑模式
   */
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditModalVisible(false);
    if (originalFormConfig) {
      setFormConfig(originalFormConfig);
    }
  };

  /**
   * 保存编辑后的表单
   */
  const handleSaveEdit = () => {
    try {
      // 直接更新已发布的表单，不创建新配置
      const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
      const updatedForms = publishedForms.map((form: any) => {
        if (form.id === formId) {
          return { ...form, config: formConfig };
        }
        return form;
      });
      localStorage.setItem('publishedForms', JSON.stringify(updatedForms));

      setIsEditMode(false);
      setEditModalVisible(false);
      message.success('表单保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  /**
   * 保存为新配置
   */
  const handleSaveAs = () => {
    if (!saveName.trim()) {
      message.error('请输入配置名称');
      return;
    }

    try {
      // 保存到表单配置列表
      const savedConfig = {
        id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: saveName,
        config: formConfig,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };

      const savedConfigs = JSON.parse(localStorage.getItem('formConfigs') || '[]');
      savedConfigs.push(savedConfig);
      localStorage.setItem('formConfigs', JSON.stringify(savedConfigs));

      setSaveModalVisible(false);
      setSaveName('');
      setIsEditMode(false);
      setEditModalVisible(false);
      message.success('表单已保存为新配置！');
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  /**
   * 处理表单设计器的字段更新
   */
  const handleFormUpdate = (updatedConfig: FormConfig) => {
    // 避免无限循环：只有当配置真正发生变化时才更新
    const currentConfigStr = JSON.stringify(formConfig);
    const updatedConfigStr = JSON.stringify(updatedConfig);
    
    if (currentConfigStr !== updatedConfigStr) {
      setFormConfig(updatedConfig);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '20px'
        }}>
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
            tip="正在加载表单..."
          />
        </Content>
      </Layout>
    );
  }

  if (!formConfig) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '20px'
        }}>
          <Result
            status="404"
            title="表单不存在"
            subTitle="抱歉，您访问的表单不存在或已被删除。"
            extra={
              <Button type="primary" onClick={handleBack}>
                返回
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '20px'
        }}>
          <Result
            status="success"
            icon={<CheckCircleOutlined />}
            title="提交成功"
            subTitle="感谢您的填写，表单已成功提交！"
            extra={[
              <Button type="primary" key="refill" onClick={handleRefill}>
                重新填写
              </Button>,
              <Button key="close" onClick={handleBack}>
                关闭
              </Button>,
            ]}
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="form-filler-layout" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 页面头部 */}
      <Header className="form-filler-header" style={{ 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="back-button"
            style={{ marginRight: 16 }}
          >
            <span className="back-text">返回</span>
          </Button>
          <Title level={4} className="form-title" style={{ margin: 0, color: '#333' }}>
            {formConfig.title}
          </Title>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            className="edit-button"
          >
            <span className="edit-text">编辑表单</span>
          </Button>
        </Space>
      </Header>

      {/* 页面主体 */}
      <Content className="form-filler-content" style={{ 
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="form-container" style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          <DynamicForm
            config={formConfig}
            onSubmit={handleSubmit}
            onCancel={handleBack}
          />
        </div>
      </Content>

      {/* 页面底部 */}
      <Footer className="form-filler-footer" style={{ 
        textAlign: 'center', 
        background: '#f5f5f5',
        borderTop: '1px solid #e8e8e8',
        padding: '16px 20px',
        color: '#666',
        fontSize: '12px'
      }}>
        表单填写页面 ©2024
      </Footer>

      {/* 编辑模式弹窗 */}
      <Modal
        title="编辑表单"
        open={editModalVisible}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit}>
            保存
          </Button>,
          <Button key="saveAs" onClick={() => setSaveModalVisible(true)}>
            保存为新配置
          </Button>
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
      >
        {formConfig && (
          <FormDesigner 
            initialConfig={formConfig}
            onConfigUpdate={handleFormUpdate}
            isEditMode={true}
          />
        )}
      </Modal>

      {/* 保存配置弹窗 */}
      <Modal
        title="保存表单配置"
        open={saveModalVisible}
        onOk={handleSaveAs}
        onCancel={() => {
          setSaveModalVisible(false);
          setSaveName('');
        }}
        okText="保存"
        cancelText="取消"
      >
        <div>
          <div style={{ marginBottom: 8 }}>配置名称：</div>
          <Input
            placeholder="请输入配置名称"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default FormFiller; 