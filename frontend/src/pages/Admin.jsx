import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  DashboardOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ParticipantsAdmin from '../components/admin/ParticipantsAdmin';
import EventsAdmin from '../components/admin/EventsAdmin';
import NewsAdmin from '../components/admin/NewsAdmin';
import './Admin.css';

const { Header, Content, Sider } = Layout;

const Admin = () => {
  const [activeKey, setActiveKey] = useState('participants');
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'participants',
      icon: <UserOutlined />,
      label: 'Участники',
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: 'События',
    },
    {
      key: 'news',
      icon: <FileTextOutlined />,
      label: 'Новости',
    },
  ];

  const handleMenuClick = ({ key }) => {
    setActiveKey(key);
  };

  const renderContent = () => {
    switch (activeKey) {
      case 'participants':
        return <ParticipantsAdmin />;
      case 'events':
        return <EventsAdmin />;
      case 'news':
        return <NewsAdmin />;
      default:
        return <ParticipantsAdmin />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: 0 }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
          <DashboardOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Админ-панель
          </span>
        </div>
        <Button 
          type="default" 
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          style={{ color: '#fff', borderColor: '#fff' }}
        >
          На сайт
        </Button>
      </Header>
      <Layout>
        <Sider 
          width={240} 
          style={{ 
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            style={{ 
              height: '100%', 
              borderRight: 0,
              paddingTop: '16px'
            }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: '24px',
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Admin;
