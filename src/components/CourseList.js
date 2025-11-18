import React, { useState, useEffect } from 'react';
import CourseService from '../services/CourseService';
import './CourseList.css';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '', description: '', credits: '' });
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = () => {
        CourseService.getAllCourses().then(response => {
            setCourses(response.data);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const courseData = {
            ...formData,
            credits: parseInt(formData.credits)
        };
        
        if (editId) {
            CourseService.updateCourse(editId, courseData).then(() => {
                loadCourses();
                resetForm();
            });
        } else {
            CourseService.createCourse(courseData).then(() => {
                loadCourses();
                resetForm();
            });
        }
    };

    const handleEdit = (course) => {
        setFormData({ 
            name: course.name, 
            code: course.code, 
            description: course.description,
            credits: course.credits 
        });
        setEditId(course.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este curso?')) {
            CourseService.deleteCourse(id).then(() => {
                loadCourses();
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', description: '', credits: '' });
        setEditId(null);
        setShowForm(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(courses.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="header">
                <h2>Gestión de Cursos</h2>
                {!showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Nuevo Curso
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card form-card">
                    <div className="form-header">
                        <h3>{editId ? '✏️ Editar Curso' : '➕ Nuevo Curso'}</h3>
                        <button className="btn-close" onClick={resetForm}>✖</button>
                    </div>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Código del Curso *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: CS101"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre del Curso *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del curso"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Descripción *</label>
                                <input
                                    type="text"
                                    placeholder="Descripción del curso"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Créditos *</label>
                                <input
                                    type="number"
                                    placeholder="Número de créditos"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                    required
                                    min="1"
                                    max="10"
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary">
                                {editId ? '💾 Actualizar' : '💾 Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="pagination-info">
                    Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, courses.length)} de {courses.length} cursos
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Créditos</th>
                                <th>Estudiantes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        No hay cursos registrados
                                    </td>
                                </tr>
                            ) : (
                                currentCourses.map(course => (
                                    <tr key={course.id}>
                                        <td><strong>{course.code}</strong></td>
                                        <td>{course.name}</td>
                                        <td>{course.description}</td>
                                        <td>
                                            <span className="badge badge-credits">
                                                {course.credits} créditos
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge">
                                                {course.enrollments ? course.enrollments.length : 0} estudiantes
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-icon btn-edit" onClick={() => handleEdit(course)} title="Editar">
                                                ✏️
                                            </button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDelete(course.id)} title="Eliminar">
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

export default CourseList;