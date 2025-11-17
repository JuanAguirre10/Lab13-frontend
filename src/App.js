import React, { useState } from 'react';
import './App.css';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import EnrollmentList from './components/EnrollmentList';

function App() {
  const [activeTab, setActiveTab] = useState('enrollments');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <h1>Sistema Académico</h1>
          </div>
          <p className="subtitle">Gestión de Estudiantes y Cursos</p>
        </div>
      </header>
      
      <nav className="navigation">
        <div className="nav-container">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={activeTab === 'enrollments' ? 'nav-btn active' : 'nav-btn'}
          >
            <span className="nav-icon">📋</span>
            Matrículas
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={activeTab === 'students' ? 'nav-btn active' : 'nav-btn'}
          >
            <span className="nav-icon">👨‍🎓</span>
            Estudiantes
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={activeTab === 'courses' ? 'nav-btn active' : 'nav-btn'}
          >
            <span className="nav-icon">📚</span>
            Cursos
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'enrollments' && <EnrollmentList />}
        {activeTab === 'students' && <StudentList />}
        {activeTab === 'courses' && <CourseList />}
      </main>

      <footer className="app-footer">
        <p>Sistema de Gestión Académica - TECSUP 2025</p>
      </footer>
    </div>
  );
}

export default App;