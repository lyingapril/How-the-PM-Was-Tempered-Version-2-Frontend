import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  DndProvider, 
} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Layout as AntLayout, 
  Menu, 
  Breadcrumb, 
  Typography, 
  Row, 
  Col, 
  Avatar, 
  Dropdown, 
  Button 
} from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  FileTextOutlined, 
  LineChartOutlined, 
  LayoutOutlined, 
  FileSearchOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = AntLayout;
const { Title, Text } = Typography;

// 侧边栏菜单配置
const menuItems = [
  {
    key: '/demands',
    icon: <FileTextOutlined />,
    label: <Link to="/demands">需求管理</Link>,
  },
  {
    key: '/roadmap',
    icon: <LayoutOutlined />,
    label: <Link to="/roadmap">产品规划</Link>,
  },
  {
    key: '/documents',
    icon: <FileSearchOutlined />,
    label: <Link to="/documents">文档中心</Link>,
  },
  {
    key: '/dashboard',
    icon: <LineChartOutlined />,
    label: <Link to="/dashboard">数据看板</Link>,
  },
];

// 用户菜单
const userMenuItems = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人信息',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // 获取当前路由

  // 渲染面包屑
  const renderBreadcrumb = () => {
    const pathMap = {
      '/demands': '需求管理',
      '/roadmap': '产品规划',
      '/documents': '文档中心',
      '/dashboard': '数据看板',
    };
    
    return (
      <Breadcrumb items={[
        { title: <Link to="/">首页</Link> },
        { title: pathMap[location.pathname as keyof typeof pathMap] || '未知页面' },
      ]} />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AntLayout style={{ minHeight: '100vh' }}>
        {/* 侧边栏 */}
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          theme="light"
          style={{
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
            zIndex: 10
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 64, 
            borderBottom: '1px solid #f0f0f0' 
          }}>
            <Title 
              level={5} 
              style={{ 
                margin: 0,
                // 关键修改：根据collapsed状态动态设置字体大小
                fontSize: collapsed ? '12px' : '14px',
                fontWeight: 'normal',
                transition: 'font-size 0.3s ease-in-out'
              }}
            >
              {collapsed ? 'PM工具' : '产品经理工具'}
            </Title>
          </div>
          <Menu 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            items={menuItems} 
            style={{ borderRight: 0 }}
          />
        </Sider>
        
        <AntLayout>
          {/* 顶部导航 */}
          <Header style={{ 
            padding: '0 24px', 
            background: '#fff', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 9
          }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown 
                menu={{ items: userMenuItems }} 
                placement="bottomRight"
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '0 12px'
                }}>
                  <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                  <Text>产品经理</Text>
                </div>
              </Dropdown>
            </div>
          </Header>
          
          {/* 主内容区 */}
          <Content style={{
            padding: 24, 
            maxHeight: 'calc(100vh - 130px)',
            overflowY: 'auto',
            background: '#fff',
            borderRadius: 4
          }}>
            <Row gutter={[16, 24]}>
              <Col span={24}>
                {/* 面包屑导航 */}
                {renderBreadcrumb()}
              </Col>
              <Col span={24}>
                {/* 页面内容出口 - 对应路由的页面会渲染在这里 */}
                <Outlet />
              </Col>
            </Row>
          </Content>
          
          {/* 页脚 */}
          <Footer style={{ textAlign: 'center' }}>
            产品经理工具 ©{new Date().getFullYear()} Created with React & Ant Design
          </Footer>
        </AntLayout>
      </AntLayout>
    </DndProvider>
  );
};

export default Layout;
