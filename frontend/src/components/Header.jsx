import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-title">
            {/* Временный логотип - можно заменить на изображение */}
            <span>🏆</span>
          </Link>
        </div>
        
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          ☰
        </button>
        
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Главная</Link>
          <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>Мероприятия</Link>
          <Link to="/participants" className="nav-link" onClick={() => setIsMenuOpen(false)}>Участники</Link>
          <Link to="/news" className="nav-link" onClick={() => setIsMenuOpen(false)}>Новости</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>О нас</Link>
          <Link to="/support" className="nav-link" onClick={() => setIsMenuOpen(false)}>Поддержка</Link>
        </nav>
        
        <div className="contacts">
          <span>+7 (924) 174-26-51</span>
        </div>
      </div>
    </header>
  );
};

export default Header;