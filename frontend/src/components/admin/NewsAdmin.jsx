import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { newsAPI } from '../../services/api';

const { TextArea } = Input;

const NewsAdmin = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Получаем все новости для админки
      const response = await newsAPI.getAllAdmin();
      setNews(response.data || []);
    } catch (error) {
      message.error('Ошибка при загрузке новостей');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingNews(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      excerpt: record.excerpt,
      image_url: record.image_url,
      author: record.author,
      published: record.published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await newsAPI.delete(id);
      message.success('Новость успешно удалена');
      fetchNews();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при удалении новости');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const newsData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        image_url: values.image_url,
        author: values.author,
        published: values.published || false,
      };

      // Если публикуется, добавляем дату публикации
      if (newsData.published && !editingNews?.published_at) {
        newsData.published_at = new Date().toISOString();
      }

      if (editingNews) {
        await newsAPI.update(editingNews.id, newsData);
        message.success('Новость успешно обновлена');
      } else {
        await newsAPI.create(newsData);
        message.success('Новость успешно создана');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchNews();
    } catch (error) {
      message.error(error.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const columns = [
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Автор',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author || '-',
    },
    {
      title: 'Опубликовано',
      dataIndex: 'published',
      key: 'published',
      render: (published) => published ? 'Да' : 'Нет',
    },
    {
      title: 'Дата публикации',
      dataIndex: 'published_at',
      key: 'published_at',
      render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '-',
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
            title="Удалить новость?"
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
          Управление новостями
        </h2>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Добавить новость
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={news}
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
        title={editingNews ? 'Редактировать новость' : 'Добавить новость'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Заголовок"
            rules={[{ required: true, message: 'Введите заголовок' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Краткое описание"
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Содержание"
            rules={[{ required: true, message: 'Введите содержание' }]}
          >
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item
            name="image_url"
            label="URL изображения"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="author"
            label="Автор"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="published"
            label="Опубликовано"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsAdmin;

