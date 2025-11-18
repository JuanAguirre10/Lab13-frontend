import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import './StudentList.css';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', code: '' });
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        StudentService.getAllStudents().then(response => {
            setStudents(response.data);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            StudentService.updateStudent(editId, formData).then(() => {
                loadStudents();
                resetForm();
            });
        } else {
            StudentService.createStudent(formData).then(() => {
                loadStudents();
                resetForm();
            });
        }
    };

    const handleEdit = (student) => {
        setFormData({ 
            firstName: student.firstName, 
            lastName: student.lastName, 
            email: student.email,
            code: student.code 
        });
        setEditId(student.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
            StudentService.deleteStudent(id).then(() => {
                loadStudents();
            });
        }
    };

    const resetForm = () => {
        setFormData({ firstName: '', lastName: '', email: '', code: '' });
        setEditId(null);
        setShowForm(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(students.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="header">
                <h2>Gestión de Estudiantes</h2>
                {!showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Nuevo Estudiante
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card form-card">
                    <div className="form-header">
                        <h3>{editId ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}</h3>
                        <button className="btn-close" onClick={resetForm}>✖</button>
                    </div>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Código *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: EST001"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Apellido *</label>
                                <input
                                    type="text"
                                    placeholder="Apellido"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
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
                    Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, students.length)} de {students.length} estudiantes
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Cursos Inscritos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        No hay estudiantes registrados
                                    </td>
                                </tr>
                            ) : (
                                currentStudents.map(student => (
                                    <tr key={student.id}>
                                        <td><strong>{student.code}</strong></td>
                                        <td>{student.firstName} {student.lastName}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <span className="badge">
                                                {student.enrollments ? student.enrollments.length : 0} cursos
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-icon btn-edit" onClick={() => handleEdit(student)} title="Editar">
                                                ✏️
                                            </button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDelete(student.id)} title="Eliminar">
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

export default StudentList;