import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Typography, Menu } from 'antd';
import { FormOutlined, ShareAltOutlined, FileTextOutlined } from '@ant-design/icons';
import FormDesigner from './components/FormDesigner';
import FormPublisher from './components/FormPublisher';
import FormFiller from './components/FormFiller';
import SubmissionList from './components/SubmissionList';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

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
    {
      key: '/submissions',
      icon: <FileTextOutlined />,
      label: <Link to="/submissions">已填写表单</Link>,
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
      <Routes>
        {/* 表单填写页面 - 独立路由，无导航栏 */}
        <Route path="/form/:formId" element={<FormFiller />} />
        
        {/* 其他页面 - 包含完整布局 */}
        <Route path="*" element={
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
                <Route path="/submissions" element={<SubmissionList />} />
              </Routes>
            </Content>

            <Footer className="app-footer">
              <div style={{ textAlign: 'center' }}>
                <div style={{ margin: 0 }}>
                  拖拽式表单设计器 ©2024 - 支持拖拽设计、配置保存、表单生成和发布
                </div>
              </div>
            </Footer>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App; 