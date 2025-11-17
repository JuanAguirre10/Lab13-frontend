import React, { useState, useEffect } from 'react';
import CourseService from '../services/CourseService';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '', description: '' });
    const [editId, setEditId] = useState(null);

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
        if (editId) {
            CourseService.updateCourse(editId, formData).then(() => {
                loadCourses();
                resetForm();
            });
        } else {
            CourseService.createCourse(formData).then(() => {
                loadCourses();
                resetForm();
            });
        }
    };

    const handleEdit = (course) => {
        setFormData({ name: course.name, code: course.code, description: course.description });
        setEditId(course.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro?')) {
            CourseService.deleteCourse(id).then(() => {
                loadCourses();
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', description: '' });
        setEditId(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Cursos</h2>
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
                <h3>{editId ? 'Editar' : 'Crear'} Curso</h3>
                <input
                    type="text"
                    placeholder="Nombre del curso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ margin: '5px', padding: '8px', width: '200px' }}
                />
                <input
                    type="text"
                    placeholder="Código"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    style={{ margin: '5px', padding: '8px', width: '150px' }}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    style={{ margin: '5px', padding: '8px', width: '300px' }}
                />
                <button type="submit" style={{ margin: '5px', padding: '8px 20px' }}>
                    {editId ? 'Actualizar' : 'Crear'}
                </button>
                {editId && <button type="button" onClick={resetForm} style={{ margin: '5px', padding: '8px 20px' }}>Cancelar</button>}
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Código</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Nombre</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Descripción</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Estudiantes</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{course.code}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{course.name}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{course.description}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                {course.students ? course.students.length : 0}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                <button onClick={() => handleEdit(course)} style={{ margin: '2px', padding: '5px 10px' }}>Editar</button>
                                <button onClick={() => handleDelete(course.id)} style={{ margin: '2px', padding: '5px 10px' }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseList;