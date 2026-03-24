<script setup>
  import { ref, reactive, onMounted } from "vue";
  import {
    getEmpleados,
    addEmpleado,
    deleteEmpleado,
    updateEmpleado
  } from "..//api/apiEmpleados";

  // Lista reactiva
  const empleados = ref([]);

  // Formulario Reactivo
  const form = reactive({
    id: null,
    nombre: "",
    email: "",
    movil: "",
    puesto: "rrhh"
  });

  const error = ref("");
  const cargando = ref(false);

  // Cargar empleados al iniciar
  onMounted(async () => {
    await cargarEmpleados()
  });

  async function cargarEmpleados() {
    cargando.value = true;
    try {
      empleados.value = await getEmpleados();
    } catch(e) {
      error.value = "Error cargando empleados";
    } finally {
      cargando.value = false;
    }
  }

  // Seleccionar empleado para editar
  function selEmpleado(emp) {
    form.id = emp.id
    form.nombre = emp.nombre
    form.email = emp.email
    form.movil = emp.movil
    form.puesto = emp.puesto
  }

  // Resetear formulario
  function resetForm() {
    form.id = null
    form.nombre = ""
    form.email = ""
    form.movil = ""
    form.puesto = "rrhh"
    error.value = ""
  }

  // Añadir o actualizar empleado
  async function addOrUpdate() {
    error.value = "";

    if (!form.nombre || !form.email) {
      error.value = "Nombre y email son obligatorios";
      return;
    }

    const empleadoData = {
      nombre: form.nombre,
      email:form.email,
      movil: form.movil,
      puesto: form.puesto
    };

    try {
      if (form.id === null) {
        await addEmpleado(empleadoData);
      } else {
        await updateEmpleado(form.id, empleadoData);
      }

      await cargarEmpleados();
      resetForm();
    } catch(e) {
      error.value = "Error guardando empleado";
    }
  }

  // Eliminar empleado
  async function delEmpleado(id) {
    try {
      await deleteEmpleado(id);
      await cargarEmpleados();
    } catch(e) {
      error.value = "Error eliminando empleado";
    }
  }
</script>

<template>
  <p>empleados</p>
</template>