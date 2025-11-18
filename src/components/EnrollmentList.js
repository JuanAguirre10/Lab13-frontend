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
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
                cancelEdit();
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
        setShowForm(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setSelectedStudent('');
        setSelectedCourse('');
        setShowForm(false);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditEnrollment(null);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="header">
                <h2>Sistema de Matrículas</h2>
                {!showForm && !editMode && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Nueva Matrícula
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card form-card">
                    <div className="form-header">
                        <h3>➕ Nueva Matrícula</h3>
                        <button className="btn-close" onClick={resetForm}>✖</button>
                    </div>
                    <div className="enrollment-form">
                        <div className="form-group">
                            <label>Seleccionar Estudiante *</label>
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
                            <label>Seleccionar Curso *</label>
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
                                💾 Matricular
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editMode && editEnrollment && (
                <div className="card form-card edit-card">
                    <div className="form-header">
                        <h3>✏️ Actualizar Matrícula</h3>
                        <button className="btn-close" onClick={cancelEdit}>✖</button>
                    </div>
                    <div className="enrollment-form">
                        <div className="edit-info">
                            <div className="info-item">
                                <strong>Estudiante:</strong> {editEnrollment.student?.firstName} {editEnrollment.student?.lastName} ({editEnrollment.student?.code})
                            </div>
                            <div className="info-item">
                                <strong>Curso:</strong> {editEnrollment.course?.name} ({editEnrollment.course?.code})
                            </div>
                            <div className="info-item">
                                <strong>Fecha Matrícula:</strong> {editEnrollment.enrollmentDate}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado *</label>
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
                            <button className="btn-secondary" onClick={cancelEdit}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleUpdateGrade}>
                                💾 Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="filters">
                    <button 
                        className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => { setFilter('all'); setCurrentPage(1); }}
                    >
                        Todas ({enrollments.length})
                    </button>
                    <button 
                        className={filter === 'ACTIVE' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => { setFilter('ACTIVE'); setCurrentPage(1); }}
                    >
                        Activas ({enrollments.filter(e => e.status === 'ACTIVE').length})
                    </button>
                    <button 
                        className={filter === 'COMPLETED' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => { setFilter('COMPLETED'); setCurrentPage(1); }}
                    >
                        Completadas ({enrollments.filter(e => e.status === 'COMPLETED').length})
                    </button>
                    <button 
                        className={filter === 'DROPPED' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => { setFilter('DROPPED'); setCurrentPage(1); }}
                    >
                        Retiradas ({enrollments.filter(e => e.status === 'DROPPED').length})
                    </button>
                </div>

                <div className="pagination-info">
                    Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredEnrollments.length)} de {filteredEnrollments.length} matrículas
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
                            {currentEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                        No hay matrículas registradas
                                    </td>
                                </tr>
                            ) : (
                                currentEnrollments.map(enrollment => (
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

                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            ← Anterior
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={currentPage === index + 1 ? 'pagination-btn active' : 'pagination-btn'}
                            >
                                {index + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Siguiente →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EnrollmentList;