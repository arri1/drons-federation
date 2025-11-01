import React from 'react';

const Events = () => {
  return (
    <div className="main-content">
      <div className="container">
        <div className="page-content">
          <h1>Мероприятия</h1>
          <p>Актуальные события и соревнования по гонкам дронов</p>
          
          <div className="card-grid">
            <div className="card">
              <h3>Гонка дронов 2024</h3>
              <p><strong>Дата:</strong> 15.06.2024</p>
              <p><strong>Место:</strong> Якутск, стадион "Туймаада"</p>
              <p><strong>Статус:</strong> Регистрация открыта</p>
              <button className="btn">Зарегистрироваться</button>
            </div>
            <div className="card">
              <h3>Чемпионат Якутии</h3>
              <p><strong>Дата:</strong> 20.07.2024</p>
              <p><strong>Место:</strong> Нерюнгри, парк культуры</p>
              <p><strong>Статус:</strong> Регистрация открыта</p>
              <button className="btn">Зарегистрироваться</button>
            </div>
            <div className="card">
              <h3>Кубок Севера</h3>
              <p><strong>Дата:</strong> 25.08.2024</p>
              <p><strong>Место:</strong> Мирный, аэродром</p>
              <p><strong>Статус:</strong> Подготовка</p>
              <button className="btn" disabled>Скоро откроется</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;