<script setup>
  import { ref, reactive, onMounted } from "vue";
  import {
    getEmpleados,
    addEmpleado,
    deleteEmpleado,
    updateEmpleado
  } from "../api/apiEmpleados";

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
  <div class="empleados">

    <h2>Gestión de empleados</h2>

    <form class="form" @submit.prevent="addOrUpdate">
      <h3>{{ form.id ? "Editar empleado" : "Nuevo empleado" }}</h3>

      <label>Nombre *</label>
      <input v-model="form.nombre" type="text" />

      <label>Email *</label>
      <input v-model="form.email" type="email" />

      <label>Móvil</label>
      <input v-model="form.movil" type="text" />

      <label>Puesto</label>
      <select v-model="form.puesto">
        <option value="rrhh">RRHH</option>
        <option value="contabilidad">Contabilidad</option>
        <option value="almacen">Almacén</option>
        <option value="ventas">Ventas</option>
      </select>

      <p class="error" v-if="error">{{ error }}</p>

      <button type="submit">
        {{ form.id ? "Guardar cambios" : "Añadir empleado" }}
      </button>

      <button type="button" class="secundario" @click="resetForm">
        Limpiar
      </button>
    </form>

    <h3>Listado</h3>

    <p v-if="cargando">Cargando...</p>

    <div class="lista" v-else>
      <div class="empleado" v-for="emp in empleados" :key="emp.id">
        <p><strong>{{ emp.nombre }}</strong></p>
        <p>{{ emp.email }}</p>
        <p>{{ emp.movil }}</p>
        <p>Puesto: {{ emp.puesto }}</p>

        <div class="acciones">
          <button @click="selEmpleado(emp)">Editar</button>
          <button class="eliminar" @click="delEmpleado(emp.id)">Eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.empleados {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form {
  display: grid;
  gap: 0.5rem;
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
}

.lista {
  display: grid;
  gap: 1rem;
}

.empleado {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.acciones {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  cursor: pointer;
}

.eliminar {
  background: #c0392b;
  color: white;
}

.secundario {
  background: #ccc;
}

.error {
  color: red;
  font-size: 0.9rem;
}
</style>