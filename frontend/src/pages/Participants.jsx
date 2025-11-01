import React, { useState, useEffect } from 'react';
import { participantsAPI } from '../services/api';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await participantsAPI.getAll();
        setParticipants(response.data);
      } catch (err) {
        console.error('Error fetching participants:', err);
        setError('Не удалось загрузить список участников. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-content">
            <h1>Участники</h1>
            <p>Загрузка рейтинга...</p>
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
            <h1>Участники</h1>
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
          <h1>Участники</h1>
          <p>Рейтинг пилотов Федерации гонок дронов Якутии</p>
          
          {participants.length > 0 ? (
            <div className="card-grid">
              {participants.map((participant, index) => (
                <div key={participant.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>{participant.avatar || '🚁'}</div>
                    <div>
                      <h3>#{index + 1} {participant.username}</h3>
                      <p><strong>Рейтинг:</strong> {participant.rating || 1000}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                    <div><strong>Побед:</strong> {participant.wins || 0}</div>
                    <div><strong>Поражений:</strong> {participant.losses || 0}</div>
                    <div><strong>Ничьих:</strong> {participant.draws || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-grid">
              <div className="card">
                <h3>Участников пока нет</h3>
                <p>Будьте первым участником федерации!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;
