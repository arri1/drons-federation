import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { newsAPI } from '../services/api';

const News = () => {
  const { id } = useParams();
  const [news, setNews] = useState(id ? null : []);
  const [singleNews, setSingleNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        if (id) {
          // Загружаем одну новость
          const response = await newsAPI.getById(id);
          setSingleNews(response.data);
        } else {
          // Загружаем все новости
          const response = await newsAPI.getAll();
          setNews(response.data);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(id 
          ? 'Не удалось загрузить новость. Проверьте подключение к серверу.'
          : 'Не удалось загрузить новости. Проверьте подключение к серверу.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-content">
            <h1>Новости</h1>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-content">
            <h1>Новости</h1>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Отображение одной новости
  if (id && singleNews) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-content">
            <article>
              <h1>{singleNews.title}</h1>
              {singleNews.publishedAt && (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Опубликовано: {formatDate(singleNews.publishedAt)}
                  {singleNews.author && ` | Автор: ${singleNews.author}`}
                </p>
              )}
              {singleNews.imageUrl && (
                <img 
                  src={singleNews.imageUrl} 
                  alt={singleNews.title}
                  style={{ maxWidth: '100%', margin: '1rem 0' }}
                />
              )}
              <div style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                {singleNews.content?.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  // Отображение списка новостей
  return (
    <div className="main-content">
      <div className="container">
        <div className="page-content">
          <h1>Новости</h1>
          <p>Актуальные новости Федерации гонок дронов Якутии</p>
          
          {news.length > 0 ? (
            <div className="card-grid">
              {news.map(item => (
                <div key={item.id} className="card">
                  <h3>{item.title}</h3>
                  {item.publishedAt && (
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      {formatDate(item.publishedAt)}
                    </p>
                  )}
                  <p>{item.excerpt || item.content?.substring(0, 150) + '...'}</p>
                  <a href={`/news/${item.id}`} className="btn">Читать далее</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-grid">
              <div className="card">
                <h3>Новостей пока нет</h3>
                <p>Следите за обновлениями!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
