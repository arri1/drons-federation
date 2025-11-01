import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll();
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Не удалось загрузить события. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusLabel = (status, registrationOpen) => {
    if (registrationOpen) return 'Регистрация открыта';
    if (status === 'preparation') return 'Подготовка';
    if (status === 'registration_open') return 'Регистрация открыта';
    if (status === 'ongoing') return 'В процессе';
    if (status === 'completed') return 'Завершено';
    if (status === 'cancelled') return 'Отменено';
    return status;
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-content">
            <h1>Мероприятия</h1>
            <p>Загрузка событий...</p>
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
            <h1>Мероприятия</h1>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-content">
          <h1>Мероприятия</h1>
          <p>Актуальные события и соревнования по гонкам дронов</p>
          
          {events.length > 0 ? (
            <div className="card-grid">
              {events.map(event => (
                <div key={event.id} className="card">
                  <h3>{event.title}</h3>
                  {event.description && <p>{event.description}</p>}
                  <p><strong>Дата:</strong> {formatDate(event.eventDate)}</p>
                  <p><strong>Место:</strong> {event.location}</p>
                  <p><strong>Статус:</strong> {getStatusLabel(event.status, event.registrationOpen)}</p>
                  {event.maxParticipants && (
                    <p><strong>Макс. участников:</strong> {event.maxParticipants}</p>
                  )}
                  <button 
                    className="btn" 
                    disabled={!event.registrationOpen}
                  >
                    {event.registrationOpen ? 'Зарегистрироваться' : 'Скоро откроется'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-grid">
              <div className="card">
                <h3>Событий пока нет</h3>
                <p>Следите за обновлениями!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
