import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import CourseService from '../services/CourseService';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
    const [editId, setEditId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        loadStudents();
        loadCourses();
    }, []);

    const loadStudents = () => {
        StudentService.getAllStudents().then(response => {
            setStudents(response.data);
        });
    };

    const loadCourses = () => {
        CourseService.getAllCourses().then(response => {
            setCourses(response.data);
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
        setFormData({ firstName: student.firstName, lastName: student.lastName, email: student.email });
        setEditId(student.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro?')) {
            StudentService.deleteStudent(id).then(() => {
                loadStudents();
            });
        }
    };

    const handleEnroll = () => {
        if (selectedStudent && selectedCourse) {
            StudentService.enrollInCourse(selectedStudent, selectedCourse).then(() => {
                loadStudents();
                setSelectedStudent(null);
                setSelectedCourse('');
            });
        }
    };

    const handleUnenroll = (studentId, courseId) => {
        StudentService.removeFromCourse(studentId, courseId).then(() => {
            loadStudents();
        });
    };

    const resetForm = () => {
        setFormData({ firstName: '', lastName: '', email: '' });
        setEditId(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Estudiantes</h2>
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
                <h3>{editId ? 'Editar' : 'Crear'} Estudiante</h3>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    style={{ margin: '5px', padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    style={{ margin: '5px', padding: '8px' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ margin: '5px', padding: '8px' }}
                />
                <button type="submit" style={{ margin: '5px', padding: '8px 20px' }}>
                    {editId ? 'Actualizar' : 'Crear'}
                </button>
                {editId && <button type="button" onClick={resetForm} style={{ margin: '5px', padding: '8px 20px' }}>Cancelar</button>}
            </form>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
                <h3>Inscribir Estudiante en Curso</h3>
                <select
                    value={selectedStudent || ''}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    style={{ margin: '5px', padding: '8px' }}
                >
                    <option value="">Seleccionar Estudiante</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>
                            {student.firstName} {student.lastName}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ margin: '5px', padding: '8px' }}
                >
                    <option value="">Seleccionar Curso</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleEnroll} style={{ margin: '5px', padding: '8px 20px' }}>Inscribir</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Nombre</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Apellido</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Email</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Cursos</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{student.firstName}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{student.lastName}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{student.email}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                {student.courses && student.courses.map(course => (
                                    <div key={course.id}>
                                        {course.name}
                                        <button
                                            onClick={() => handleUnenroll(student.id, course.id)}
                                            style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}
                                        >
                                            Desmatricular
                                        </button>
                                    </div>
                                ))}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                <button onClick={() => handleEdit(student)} style={{ margin: '2px', padding: '5px 10px' }}>Editar</button>
                                <button onClick={() => handleDelete(student.id)} style={{ margin: '2px', padding: '5px 10px' }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentList;