<script setup>
    import { reactive, ref } from "vue";

    const empleados = reactive([]);
    const form = reactive({
        id: null,
        nombre: "",
        email: "",
        movil: "",
        puesto: "rrhh"
    });

    function addEmpleado() {
        error.value = "";

        if (!form.nombre || !form.email) {
            error.vlue = "Nombre y email son obligatorios";
            return;
        }

        if (form.id === null) {
            empleados.push({
                id: Date.now(),
                nombre: form.nombre,
                email: form.email,
                movil: form.movil,
                puesto: form.puesto
            })
        } else {
            const index = empleados.findIndex(e => e.id === form.id);
            empleados[index] = { ...form };
        }

        resetForm();
    }

    function getEmpleado(emp) {
        form.id = emp.id
        form.nombre = emp.nombre
        form.email = emp.email
        form.movil = emp.movil
        form.puesto = emp.puesto
    }

    function delEmpleado(id) {
        const index = empleados.findIndex(e => e.id === id);
        empleados.splice(index, 1);
    }

    function resetForm() {
        form.id = null
        form.nombre = ""
        form.email = ""
        form.movil = ""
        form.puesto = "rrhh"
    }
</script>

<template>
    <p>Empleados</p>
</template>