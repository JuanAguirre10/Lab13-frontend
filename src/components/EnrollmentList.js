import React, { useState, useEffect } from 'react';
import EnrollmentService from '../services/EnrollmentService';
import StudentService from '../services/StudentService';
import CourseService from '../services/CourseService';
import './EnrollmentList.css';

function EnrollmentList() {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editEnrollment, setEditEnrollment] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        EnrollmentService.getAllEnrollments().then(response => {
            setEnrollments(response.data);
        });
        StudentService.getAllStudents().then(response => {
            setStudents(response.data);
        });
        CourseService.getAllCourses().then(response => {
            setCourses(response.data);
        });
    };

    const handleEnroll = () => {
        if (selectedStudent && selectedCourse) {
            EnrollmentService.createEnrollment(selectedStudent, selectedCourse).then(() => {
                loadData();
                resetForm();
            }).catch(error => {
                alert('Error al crear la matrícula. Puede que ya esté inscrito.');
            });
        }
    };

    const handleUpdateGrade = () => {
        if (editEnrollment) {
            EnrollmentService.updateEnrollment(editEnrollment.id, editEnrollment).then(() => {
                loadData();
                setEditMode(false);
                setEditEnrollment(null);
            });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta matrícula?')) {
            EnrollmentService.deleteEnrollment(id).then(() => {
                loadData();
            });
        }
    };

    const openEditMode = (enrollment) => {
        setEditEnrollment({ ...enrollment });
        setEditMode(true);
    };

    const resetForm = () => {
        setSelectedStudent('');
        setSelectedCourse('');
        setShowForm(false);
    };

    const getStatusBadge = (status) => {
        const badges = {
            ACTIVE: { class: 'badge-active', text: 'Activo' },
            COMPLETED: { class: 'badge-completed', text: 'Completado' },
            DROPPED: { class: 'badge-dropped', text: 'Retirado' }
        };
        const badge = badges[status] || badges.ACTIVE;
        return <span className={`badge ${badge.class}`}>{badge.text}</span>;
    };

    const filteredEnrollments = enrollments.filter(e => {
        if (filter === 'all') return true;
        return e.status === filter;
    });

    return (
        <div className="container">
            <div className="header">
                <h2>Sistema de Matrículas</h2>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancelar' : '+ Nueva Matrícula'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3>Nueva Matrícula</h3>
                    <div className="enrollment-form">
                        <div className="form-group">
                            <label>Seleccionar Estudiante</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="select-enrollment"
                            >
                                <option value="">-- Seleccionar Estudiante --</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.code} - {student.firstName} {student.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Seleccionar Curso</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="select-enrollment"
                            >
                                <option value="">-- Seleccionar Curso --</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} - {course.name} ({course.credits} créditos)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={resetForm}>
                                Cancelar
                            </button>
                            <button 
                                className="btn-primary" 
                                onClick={handleEnroll}
                                disabled={!selectedStudent || !selectedCourse}
                            >
                                Matricular
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editMode && editEnrollment && (
                <div className="card">
                    <h3>Actualizar Matrícula</h3>
                    <div className="enrollment-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    value={editEnrollment.status}
                                    onChange={(e) => setEditEnrollment({ ...editEnrollment, status: e.target.value })}
                                >
                                    <option value="ACTIVE">Activo</option>
                                    <option value="COMPLETED">Completado</option>
                                    <option value="DROPPED">Retirado</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nota (0-20)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.01"
                                    value={editEnrollment.grade || ''}
                                    onChange={(e) => setEditEnrollment({ ...editEnrollment, grade: e.target.value })}
                                    placeholder="Ingrese nota"
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => { setEditMode(false); setEditEnrollment(null); }}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleUpdateGrade}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="filters">
                    <button 
                        className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('all')}
                    >
                        Todas ({enrollments.length})
                    </button>
                    <button 
                        className={filter === 'ACTIVE' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('ACTIVE')}
                    >
                        Activas ({enrollments.filter(e => e.status === 'ACTIVE').length})
                    </button>
                    <button 
                        className={filter === 'COMPLETED' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('COMPLETED')}
                    >
                        Completadas ({enrollments.filter(e => e.status === 'COMPLETED').length})
                    </button>
                    <button 
                        className={filter === 'DROPPED' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('DROPPED')}
                    >
                        Retiradas ({enrollments.filter(e => e.status === 'DROPPED').length})
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estudiante</th>
                                <th>Curso</th>
                                <th>Créditos</th>
                                <th>Fecha Matrícula</th>
                                <th>Estado</th>
                                <th>Nota</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                        No hay matrículas registradas
                                    </td>
                                </tr>
                            ) : (
                                filteredEnrollments.map(enrollment => (
                                    <tr key={enrollment.id}>
                                        <td>#{enrollment.id}</td>
                                        <td>
                                            <div className="student-info">
                                                <strong>{enrollment.student?.firstName} {enrollment.student?.lastName}</strong>
                                                <small>{enrollment.student?.code}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="course-info">
                                                <strong>{enrollment.course?.name}</strong>
                                                <small>{enrollment.course?.code}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-credits">
                                                {enrollment.course?.credits}
                                            </span>
                                        </td>
                                        <td>{enrollment.enrollmentDate}</td>
                                        <td>{getStatusBadge(enrollment.status)}</td>
                                        <td>
                                            {enrollment.grade ? (
                                                <span className={`grade ${enrollment.grade >= 10.5 ? 'grade-pass' : 'grade-fail'}`}>
                                                    {enrollment.grade}
                                                </span>
                                            ) : (
                                                <span className="no-grade">Sin nota</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className="btn-icon btn-edit" onClick={() => openEditMode(enrollment)} title="Editar">
                                                ✏️
                                            </button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDelete(enrollment.id)} title="Eliminar">
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EnrollmentList;