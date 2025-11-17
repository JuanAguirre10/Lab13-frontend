import axios from 'axios';

const API_URL = 'https://lab13-student-course-api.onrender.com/api/enrollments';

class EnrollmentService {
    getAllEnrollments() {
        return axios.get(API_URL);
    }

    getEnrollmentById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    getEnrollmentsByStudent(studentId) {
        return axios.get(`${API_URL}/student/${studentId}`);
    }

    getEnrollmentsByCourse(courseId) {
        return axios.get(`${API_URL}/course/${courseId}`);
    }

    createEnrollment(studentId, courseId) {
        return axios.post(`${API_URL}?studentId=${studentId}&courseId=${courseId}`);
    }

    updateEnrollment(id, enrollment) {
        return axios.put(`${API_URL}/${id}`, enrollment);
    }

    deleteEnrollment(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new EnrollmentService();