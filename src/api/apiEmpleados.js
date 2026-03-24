import axios from "axios";

// URL base de la API REST
const API_URL = "http://localhost:3000/empleados";

// Obtener lista completa de empleados
export const getEmpleados = () => {
    return axios.get(API_URL)
        .then(res => res.data);
}

// Añadir empleado nuevo
export const addEmpleado = (nuevoEmpleado) => {
    return axios.post(API_URL, nuevoEmpleado)
        .then(res => res.data);
}

// Eliminar empleado por ID
export const deleteEmpleado = (id) => {
    return axios.delete(`${API_URL}/${id}`)
        .then(res => res.data);
}

// Actualizar empleado por ID
export const updateEmpleado = (id, empleadoActualizado) => {
    return axios.put(`${API_URL}/${id}`)
        .then(res => res.data);
}

// Obtener empleado por ID (para cargar en el formulario)
export const getEmpleadoById = (id) => {
    return axios.get(`${API_URL}/${id}`)
        .then(res => res.data);
}