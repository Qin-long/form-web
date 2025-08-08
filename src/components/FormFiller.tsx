import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, message, Result, Spin, Modal, Input } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, EditOutlined } from '@ant-design/icons';
import DynamicForm from './DynamicForm';
import FormDesigner from './FormDesigner';
import type { FormConfig, FormData } from '../types/form';

/**
 * 表单填写页面组件
 * 完全独立的表单填写页面，仅显示表单内容
 */
const FormFiller: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formId, setFormId] = useState<string>('');
  const [initialValues, setInitialValues] = useState<FormData>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [originalFormConfig, setOriginalFormConfig] = useState<FormConfig | null>(null);
  const { formId: routeFormId } = useParams<{ formId: string }>();
  const [searchParams] = useSearchParams();
  
  // 获取URL参数
  const isEmbedded = searchParams.get('embedded') === 'true';
  const isPreview = searchParams.get('preview') === 'true';
  const submissionId = searchParams.get('submission');

  /**
   * 从URL参数获取表单ID并加载表单配置
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || routeFormId || '';
    setFormId(id);
    
    // 如果是预览模式且有submissionId，直接加载提交数据
    if (isPreview && submissionId) {
      loadSubmissionData(submissionId);
    } else if (id) {
      // 正常模式，加载表单配置
      loadFormConfig(id);
    } else {
      setLoading(false);
    }
  }, [routeFormId, submissionId, isPreview]);

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
        // 确保表单配置包含所有必要字段
        const config = {
          ...publishedForm.config,
          fields: publishedForm.config.fields.map((field: any, index: number) => ({
            ...field,
            id: field.id || `field_${Date.now()}_${index}`, // 确保每个字段都有id
          }))
        };
        setFormConfig(config);
        
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
   * 加载提交数据（预览模式）
   */
  const loadSubmissionData = (submissionId: string) => {
    try {
      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      const submission = submissions.find((s: any) => s.id === submissionId);
      
      if (submission) {
        // 优先使用提交数据中的表单配置
        if (submission.config) {
          const config = {
            ...submission.config,
            fields: submission.config.fields.map((field: any, index: number) => ({
              ...field,
              id: field.id || `field_${Date.now()}_${index}`, // 确保每个字段都有id
            }))
          };
          setFormConfig(config);
          setInitialValues(submission.data);
        } else {
          // 如果没有配置，尝试通过formId加载表单配置
          const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
          const publishedForm = publishedForms.find((form: any) => form.id === submission.formId);
          
          if (publishedForm) {
            const config = {
              ...publishedForm.config,
              fields: publishedForm.config.fields.map((field: any, index: number) => ({
                ...field,
                id: field.id || `field_${Date.now()}_${index}`, // 确保每个字段都有id
              }))
            };
            setFormConfig(config);
            setInitialValues(submission.data);
          } else {
            message.error('表单配置不存在');
            return;
          }
        }
        // 预览模式不设置submitted状态，直接显示表单内容
      } else {
        message.error('提交数据不存在');
      }
    } catch (error) {
      message.error('加载提交数据失败');
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
        formId: formId, // 保存当前表单的ID
        formTitle: formConfig?.title || '未知表单',
        data,
        config: formConfig, // 保存表单配置，用于预览
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

  // 加载状态
  if (loading) {
    return (
      <div className="form-filler-page" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
          tip="正在加载表单..."
        />
      </div>
    );
  }

  // 表单不存在
  if (!formConfig) {
    return (
      <div className="form-filler-page" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Result
          status="404"
          title="表单不存在"
          subTitle="抱歉，您访问的表单不存在或已被删除。"
          extra={
            !isEmbedded ? (
              <Button type="primary" onClick={handleBack}>
                返回
              </Button>
            ) : null
          }
        />
      </div>
    );
  }

  // 提交成功状态
  if (submitted) {
    return (
      <div className="form-filler-page" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
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
      </div>
    );
  }

  // 表单填写页面：仅显示表单内容，无其他UI
  return (
    <div className="form-filler-page">
      {/* 编辑按钮 - 在预览模式下显示 */}
      {isPreview && (
        <div style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            size="small"
          >
            编辑表单
          </Button>
        </div>
      )}
      
      <div className="form-filler-content">
        <DynamicForm
          config={{
            ...formConfig,
            title: '' // 不显示标题
          }}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleBack}
          readOnly={isPreview}
          hideSubmit={isPreview} // 预览模式隐藏提交按钮
        />
      </div>

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
            initialConfig={{
              title: formConfig.title,
              fields: formConfig.fields, // 直接使用原始字段，包含id
              layout: formConfig.layout,
              responsive: formConfig.responsive,
            }}
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
    </div>
  );
};

export default FormFiller; 