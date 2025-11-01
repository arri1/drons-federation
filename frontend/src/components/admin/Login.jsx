import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { authAPI } from '../../services/api';
import { setToken } from '../../utils/auth';
import './Login.css';

const Login = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await authAPI.login(values.password);
      
      if (response.data.success) {
        // Сохраняем токен в localStorage
        setToken(response.data.token);
        message.success('Вход выполнен успешно');
        onSuccess();
      } else {
        message.error('Неверный пароль');
      }
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <LockOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '8px' }}>Админ-панель</h2>
          <p style={{ color: '#8c8c8c', marginBottom: '24px' }}>
            Введите пароль для доступа
          </p>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password
              placeholder="Пароль"
              prefix={<LockOutlined />}
              size="large"
              autoFocus
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

