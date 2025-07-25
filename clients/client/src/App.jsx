import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MovieDetail from './pages/MovieDetailPage.jsx';
import AddMoviePage from './pages/AddMoviePage.jsx';
import OmdbSearchPage from './pages/OmdbSearchPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  


function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <NavLink className="navbar-brand" to="/">Кінобаза</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                  to="/"
                  end
                >
                  Головна
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                  to="/add"
                >
                  Додати фільм
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
                  to="/omdb"
                >
                  Пошук по OMDb
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddMoviePage />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/omdb" element={<OmdbSearchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
