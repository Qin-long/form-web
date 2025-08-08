import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Typography, Menu } from 'antd';
import { FormOutlined, ShareAltOutlined, SettingOutlined } from '@ant-design/icons';
import FormDesigner from './components/FormDesigner';
import FormPublisher from './components/FormPublisher';
import FormFiller from './components/FormFiller';
import './App.css';

const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

/**
 * 导航菜单组件
 */
const NavigationMenu: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/',
      icon: <FormOutlined />,
      label: <Link to="/">表单设计</Link>,
    },
    {
      key: '/publish',
      icon: <ShareAltOutlined />,
      label: <Link to="/publish">表单发布</Link>,
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
      style={{ flex: 1, minWidth: 0 }}
    />
  );
};

/**
 * 主应用组件
 */
const App: React.FC = () => {
  return (
    <Router>
      <Layout className="app-layout">
        <Header className="app-header" style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: 0, marginRight: 48 }}>
            拖拽式表单设计器
          </Title>
          <NavigationMenu />
        </Header>
        
        <Content style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<FormDesigner />} />
            <Route path="/publish" element={<FormPublisher />} />
            <Route path="/form/:formId" element={<FormFiller />} />
          </Routes>
        </Content>

        <Footer className="app-footer">
          <div style={{ textAlign: 'center' }}>
            <Paragraph style={{ margin: 0 }}>
              拖拽式表单设计器 ©2024 - 支持拖拽设计、配置保存、表单生成和发布
            </Paragraph>
          </div>
        </Footer>
      </Layout>
    </Router>
  );
};

export default App; 