import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { participantsAPI, eventsAPI, newsAPI } from '../services/api';

const Home = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные параллельно
        const [playersRes, eventsRes, newsRes] = await Promise.all([
          participantsAPI.getTop(3),
          eventsAPI.getUpcoming(3),
          newsAPI.getLatest(2)
        ]);

        setTopPlayers(playersRes.data);
        setUpcomingEvents(eventsRes.data);
        setLatestNews(newsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Загрузка...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="page">
          <section className="hero">
            <h1>Федерация гонок дронов Республики Саха (Якутия)</h1>
            <p>Развитие спортивной дисциплины "гонки дронов" в Якутии</p>
          </section>

          {/* Рейтинг лучших участников */}
          <section className="section">
            <h2>Рейтинг лучших участников</h2>
            {topPlayers.length > 0 ? (
              <>
                <div className="players-column">
                  {topPlayers.map(player => (
                    <div key={player.id} className="player-card-column">
                      <div className="player-rank-number">#{player.rank}</div>
                      <div className="player-avatar">
                        {player.avatar || '🚁'}
                      </div>
                      <div className="player-info-compact">
                        <h3 className="player-username">{player.username}</h3>
                        <div className="player-stats-compact">
                          <div className="player-stat">
                            <span>🏆 Побед:</span>
                            <strong>{player.wins || 0}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="player-rating">
                        {player.rating || 1000}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/participants" className="btn btn-center">Весь рейтинг</Link>
              </>
            ) : (
              <p>Нет данных об участниках</p>
            )}
          </section>

          {/* Предстоящие события */}
          <section className="section">
            <h2>Предстоящие события</h2>
            {upcomingEvents.length > 0 ? (
              <div className="card-grid">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="card">
                    <h3>{event.title}</h3>
                    <p><strong>Дата:</strong> {formatDate(event.eventDate)}</p>
                    <p><strong>Место:</strong> {event.location}</p>
                    <p><strong>Статус:</strong> {
                      event.registrationOpen ? 'Регистрация открыта' : 
                      event.status === 'preparation' ? 'Подготовка' : 
                      event.status
                    }</p>
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
              <p>Нет предстоящих событий</p>
            )}
          </section>

          {/* Последние новости */}
          <section className="section">
            <h2>Последние новости</h2>
            {latestNews.length > 0 ? (
              <>
                <div className="card-grid">
                  {latestNews.map(news => (
                    <div key={news.id} className="card">
                      <h3>{news.title}</h3>
                      <p>{news.excerpt || news.content?.substring(0, 100) + '...'}</p>
                      <Link to={`/news/${news.id}`} className="btn">Читать далее</Link>
                    </div>
                  ))}
                </div>
                <Link to="/news" className="btn btn-center">Все новости</Link>
              </>
            ) : (
              <p>Новостей пока нет</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
