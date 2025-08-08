import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Tooltip, Popconfirm, message, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import type { FormData } from '../types/form';

/**
 * 提交数据接口
 */
interface Submission {
  id: string;
  formId: string;
  formTitle: string;
  data: FormData;
  submitTime: string;
  config: any;
}

/**
 * 已填写表单列表组件
 */
const SubmissionList: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  /**
   * 加载提交数据
   */
  useEffect(() => {
    loadSubmissions();
  }, []);

  /**
   * 从localStorage加载提交数据
   */
  const loadSubmissions = () => {
    try {
      const data = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      setSubmissions(data);
    } catch (error) {
      message.error('加载数据失败');
    }
  };

  /**
   * 生成预览URL
   */
  const generatePreviewUrl = (submission: Submission) => {
    const baseUrl = window.location.origin;
    // 使用表单ID和提交ID生成预览URL
    return `${baseUrl}/form/${submission.formId}?preview=true&submission=${submission.id}`;
  };

  /**
   * 预览提交数据
   */
  const handlePreview = (submission: Submission) => {
    // 直接在新窗口打开预览URL
    const previewUrl = generatePreviewUrl(submission);
    window.open(previewUrl, '_blank');
  };

  /**
   * 复制提交数据
   */
  const handleCopyData = (submission: Submission) => {
    try {
      const dataStr = JSON.stringify(submission.data, null, 2);
      navigator.clipboard.writeText(dataStr).then(() => {
        message.success('数据已复制到剪贴板');
      });
    } catch (error) {
      message.error('复制失败');
    }
  };

  /**
   * 删除提交数据
   */
  const handleDelete = (submissionId: string) => {
    try {
      const updatedSubmissions = submissions.filter(s => s.id !== submissionId);
      localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
      setSubmissions(updatedSubmissions);
      message.success('数据已删除');
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '表单标题',
      dataIndex: 'formTitle',
      key: 'formTitle',
      render: (text: string, record: Submission) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>ID: {record.formId}</div>
        </div>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '数据字段数',
      key: 'fieldCount',
      render: (_: any, record: Submission) => (
        <Tag color="blue">{Object.keys(record.data).length}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Submission) => (
        <Space size="small">
          <Tooltip title="预览表单">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="复制数据">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyData(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条提交数据吗？"
            onConfirm={() => handleDelete(record.id)}
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
        title="已填写表单列表"
        extra={
          <Button
            type="primary"
            onClick={() => {
              const data = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
              const dataStr = JSON.stringify(data, null, 2);
              navigator.clipboard.writeText(dataStr).then(() => {
                message.success('所有数据已复制到剪贴板');
              });
            }}
          >
            导出所有数据
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* 预览弹窗 */}
      <Modal
        title={`预览表单 - ${selectedSubmission?.formTitle || ''}`}
        open={previewModalVisible}
        onCancel={() => {
          setPreviewModalVisible(false);
          setSelectedSubmission(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setPreviewModalVisible(false);
            setSelectedSubmission(null);
          }}>
            关闭
          </Button>
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
      >
        {selectedSubmission && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px', border: '1px solid #d6e4ff' }}>
              <div style={{ fontWeight: 500, marginBottom: 8, color: '#1890ff' }}>提交信息</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                <div>表单标题：{selectedSubmission.formTitle}</div>
                <div>表单ID：{selectedSubmission.formId}</div>
                <div>提交ID：{selectedSubmission.id}</div>
                <div>提交时间：{new Date(selectedSubmission.submitTime).toLocaleString()}</div>
                <div>数据字段数：{Object.keys(selectedSubmission.data).length}</div>
              </div>
            </div>
            
            {/* 嵌入表单预览 */}
            <iframe
              src={generatePreviewUrl(selectedSubmission)}
              style={{
                width: '100%',
                height: '600px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
              }}
              title="表单预览"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionList; 