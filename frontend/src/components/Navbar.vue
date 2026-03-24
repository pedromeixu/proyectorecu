<template>
    <nav class="navbar">
        <ul>
            <li><router-link to="/" class="nav-link">Inicio</router-link></li>
            <li><router-link to="/empleados" class="nav-link">Empleados</router-link></li>
            <li><router-link to="/tareas" class="nav-link">Tareas</router-link></li>
            <li><router-link to="/estadisticas" class="nav-link">Estadísticas</router-link></li>
            <li><router-link to="/about" class="nav-link">Sobre nosotros</router-link></li>
        </ul>
    </nav>
</template>
<style scoped>
    .navbar {
        background: #222;
        padding: 1rem;
    }

    ul {
        display: flex;
        gap: 1rem;
        list-style: none;
    }

    a {
        color: white;
        text-decoration: none;
    }

    a.router-link-active {
        font-weight: bold;
        text-decoration: underline;
    }
</style>