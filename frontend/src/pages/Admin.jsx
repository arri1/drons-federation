import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ParticipantsAdmin from "../components/admin/ParticipantsAdmin";
import EventsAdmin from "../components/admin/EventsAdmin";
import NewsAdmin from "../components/admin/NewsAdmin";
import Login from "../components/admin/Login";
import { isAuthenticated, removeToken } from "../utils/auth";
import "./Admin.css";

const { Header, Content, Sider } = Layout;

const Admin = () => {
  const [activeKey, setActiveKey] = useState("participants");
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем аутентификацию при загрузке
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
  };

  // Если не авторизован, показываем форму входа
  if (!authenticated) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  const menuItems = [
    {
      key: "participants",
      icon: <UserOutlined />,
      label: "Участники",
    },
    {
      key: "events",
      icon: <CalendarOutlined />,
      label: "События",
    },
    {
      key: "news",
      icon: <FileTextOutlined />,
      label: "Новости",
    },
  ];

  const handleMenuClick = ({ key }) => {
    setActiveKey(key);
  };

  const renderContent = () => {
    switch (activeKey) {
      case "participants":
        return <ParticipantsAdmin />;
      case "events":
        return <EventsAdmin />;
      case "news":
        return <NewsAdmin />;
      default:
        return <ParticipantsAdmin />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", margin: 0 }}>
      <Header
        style={{
          background: "#001529",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          <DashboardOutlined
            style={{ fontSize: "20px", marginRight: "12px" }}
          />
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            Админ-панель
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{ borderColor: "#fff" }}
          >
            На сайт
          </Button>
          <Button
            type="default"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ borderColor: "#fff" }}
          >
            Выйти
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider
          width={240}
          style={{
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            style={{
              height: "100%",
              borderRight: 0,
              paddingTop: "16px",
            }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "24px",
              padding: "24px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              minHeight: "calc(100vh - 112px)",
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
