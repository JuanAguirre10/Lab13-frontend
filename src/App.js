import React, { useState } from 'react';
import './App.css';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';

function App() {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="App">
      <header style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}>
        <h1>Sistema de Gestión Estudiantes - Cursos</h1>
      </header>
      
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '10px 20px',
              margin: '5px',
              backgroundColor: activeTab === 'students' ? '#61dafb' : '#ccc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Estudiantes
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '10px 20px',
              margin: '5px',
              backgroundColor: activeTab === 'courses' ? '#61dafb' : '#ccc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cursos
          </button>
        </div>

        {activeTab === 'students' ? <StudentList /> : <CourseList />}
      </div>
    </div>
  );
}

export default App;