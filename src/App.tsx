import React from 'react';
import { Layout, Typography } from 'antd';
import FormDesigner from './components/FormDesigner';
import './App.css';

const { Header, Footer } = Layout;
const { Title, Paragraph } = Typography;

const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          拖拽式表单设计器
        </Title>
      </Header>
      
      <FormDesigner />

      <Footer className="app-footer">
        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ margin: 0 }}>
            拖拽式表单设计器 ©2024 - 支持拖拽设计、配置保存、表单生成
          </Paragraph>
        </div>
      </Footer>
    </Layout>
  );
};

export default App; 