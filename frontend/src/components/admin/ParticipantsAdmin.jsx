import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { participantsAPI } from '../../services/api';

const ParticipantsAdmin = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await participantsAPI.getAll();
      setParticipants(response.data || []);
    } catch (error) {
      message.error('Ошибка при загрузке участников');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingParticipant(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingParticipant(record);
    form.setFieldsValue({
      username: record.username,
      avatar: record.avatar,
      rating: record.rating,
      wins: record.wins,
      losses: record.losses,
      draws: record.draws,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await participantsAPI.delete(id);
      message.success('Участник успешно удален');
      fetchParticipants();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при удалении участника');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingParticipant) {
        await participantsAPI.update(editingParticipant.id, values);
        message.success('Участник успешно обновлен');
      } else {
        await participantsAPI.create(values);
        message.success('Участник успешно создан');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchParticipants();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const columns = [
    {
      title: 'Рейтинг',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Аватар',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 100,
      align: 'center',
      render: (avatar) => (
        <span style={{ fontSize: '28px', display: 'inline-block' }}>
          {avatar || '🚁'}
        </span>
      ),
    },
    {
      title: 'Имя',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Побед',
      dataIndex: 'wins',
      key: 'wins',
    },
    {
      title: 'Поражений',
      dataIndex: 'losses',
      key: 'losses',
    },
    {
      title: 'Ничьих',
      dataIndex: 'draws',
      key: 'draws',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить участника?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.id)}
            okText="Да, удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          Управление участниками
        </h2>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Добавить участника
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={participants}
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Всего: ${total}`
        }}
        bordered
      />

      <Modal
        title={editingParticipant ? 'Редактировать участника' : 'Добавить участника'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Аватар (эмодзи)"
          >
            <Input placeholder="🚁" />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Рейтинг"
            rules={[{ required: true, message: 'Введите рейтинг' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="wins"
            label="Побед"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="losses"
            label="Поражений"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="draws"
            label="Ничьих"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParticipantsAdmin;

