import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Данные для топа игроков
  const topPlayers = [
    {
      id: 1,
      rank: 1,
      username: "SkyRacer",
      rating: 1540,
      wins: 12,
      avatar: "🚁"
    },
    {
      id: 2,
      rank: 2,
      username: "DroneMaster", 
      rating: 1420,
      wins: 8,
      avatar: "⚡"
    },
    {
      id: 3,
      rank: 3,
      username: "ArcticFlyer",
      rating: 1380,
      wins: 6,
      avatar: "❄️"
    }
  ];

  return (
    <div className="main-content">
      <div className="container">
        <div className="page">
          <section className="hero">
            <h1>Федерация гонок дронов Республики Саха (Якутия)</h1>
            <p>Развитие спортивной дисциплины "гонки дронов" в Якутии</p>
          </section>

          {/* ОБНОВЛЕННАЯ СЕКЦИЯ - Рейтинг в колонну */}
          <section className="section">
            <h2>Рейтинг лучших участников</h2>
            <div className="players-column">
              {topPlayers.map(player => (
                <div key={player.id} className="player-card-column">
                  <div className="player-rank-number">#{player.rank}</div>
                  <div className="player-avatar">
                    {player.avatar}
                  </div>
                  <div className="player-info-compact">
                    <h3 className="player-username">{player.username}</h3>
                    <div className="player-stats-compact">
                      <div className="player-stat">
                        <span>🏆 Побед:</span>
                        <strong>{player.wins}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="player-rating">
                    {player.rating}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/participants" className="btn btn-center">Весь рейтинг</Link>
          </section>

          {/* Остальные секции остаются без изменений */}
          <section className="section">
            <h2>Предстоящие события</h2>
            <div className="card-grid">
              <div className="card">
                <h3>Гонка дронов 2024</h3>
                <p><strong>Дата:</strong> 15.06.2024</p>
                <p><strong>Место:</strong> Якутск</p>
                <button className="btn">Зарегистрироваться</button>
              </div>
              <div className="card">
                <h3>Чемпионат Якутии</h3>
                <p><strong>Дата:</strong> 20.07.2024</p>
                <p><strong>Место:</strong> Нерюнгри</p>
                <button className="btn">Зарегистрироваться</button>
              </div>
              <div className="card">
                <h3>Кубок Севера</h3>
                <p><strong>Дата:</strong> 25.08.2024</p>
                <p><strong>Место:</strong> Мирный</p>
                <button className="btn">Зарегистрироваться</button>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Последние новости</h2>
            <div className="card-grid">
              <div className="card">
                <h3>Новый сезон гонок</h3>
                <p>Открытие сезона 2024 состоится 15 июня...</p>
                <Link to="/news" className="btn">Читать далее</Link>
              </div>
              <div className="card">
                <h3>Набор участников</h3>
                <p>Объявляем набор новых участников в федерацию...</p>
                <Link to="/news" className="btn">Читать далее</Link>
              </div>
            </div>
            <Link to="/news" className="btn btn-center">Все новости</Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;