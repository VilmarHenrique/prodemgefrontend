<template>
  <header class="app-header">
    <nav>
      <ul style="padding: 12px;">
        <li><router-link to="/">Pesquisa de Pessoas</router-link></li>
        <li><router-link to="/cadastro">Cadastro de Pessoa</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
};
</script>

<style scoped>
.app-header {
  background-color: #007bff;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
}

li {
  display: inline;
}

a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

a:hover {
  text-decoration: underline;
}
</style>
