import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  InputNumber,
  message,
  Popconfirm,
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { eventsAPI } from '../../services/api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data || []);
    } catch (error) {
      message.error('Ошибка при загрузке событий');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingEvent(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      event_date: record.event_date ? dayjs(record.event_date) : null,
      event_time: record.event_time ? dayjs(record.event_time, 'HH:mm:ss') : null,
      location: record.location,
      status: record.status,
      registration_open: record.registration_open,
      max_participants: record.max_participants,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await eventsAPI.delete(id);
      message.success('Событие успешно удалено');
      fetchEvents();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при удалении события');
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Преобразуем данные для отправки
      const eventData = {
        title: values.title,
        description: values.description,
        event_date: values.event_date ? values.event_date.format('YYYY-MM-DD') : null,
        event_time: values.event_time ? values.event_time.format('HH:mm:ss') : null,
        location: values.location,
        status: values.status,
        registration_open: values.registration_open || false,
        max_participants: values.max_participants,
      };

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, eventData);
        message.success('Событие успешно обновлено');
      } else {
        await eventsAPI.create(eventData);
        message.success('Событие успешно создано');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchEvents();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Дата',
      dataIndex: 'event_date',
      key: 'event_date',
      render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '-',
    },
    {
      title: 'Место',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Регистрация',
      dataIndex: 'registration_open',
      key: 'registration_open',
      render: (open) => open ? 'Открыта' : 'Закрыта',
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
            title="Удалить событие?"
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
          Управление событиями
        </h2>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Добавить событие
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={events}
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
        title={editingEvent ? 'Редактировать событие' : 'Добавить событие'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="event_date"
            label="Дата события"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Место проведения"
            rules={[{ required: true, message: 'Введите место' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="preparation">Подготовка</Option>
              <Option value="registration_open">Регистрация открыта</Option>
              <Option value="ongoing">В процессе</Option>
              <Option value="completed">Завершено</Option>
              <Option value="cancelled">Отменено</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="registration_open"
            label="Регистрация открыта"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="max_participants"
            label="Максимум участников"
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventsAdmin;

