<template>
  <div class="search-container">
    <h1>Pesquisa de Pessoas</h1>
    <div class="search-grid">
      <div class="search-group">
        <input v-model="searchId" placeholder="Buscar por ID">
      </div>
      <div class="search-group">
        <input v-model="searchNome" placeholder="Buscar por Nome">
      </div>
      <div class="search-group">
        <input @input="formatCPF" v-model="searchCpf"  placeholder="Buscar por CPF">
      </div>
      <button @click="search" class="search-button">Pesquisar</button>
    </div>
    <ul class="results-list">
      <li v-for="pessoa in pessoas" :key="pessoa.id" class="result-item" @click="viewPessoa(pessoa.id)">
        {{ pessoa.nome }} - {{ pessoa.cpf }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchId: '',
      searchNome: '',
      searchCpf: '',
      pessoas: []
    };
  },
  methods: {
    search() {
      const query = new URLSearchParams();
      if (this.searchId) query.append('id', this.searchId);
      if (this.searchNome) query.append('nome', this.searchNome);
      if (this.searchCpf) query.append('cpf', this.searchCpf);

      fetch(`http://localhost:8000/api/pessoas?${query.toString()}`)
        .then(response => response.json())
        .then(data => {
          this.pessoas = data;
        });
    },
     formatCPF() {
      let cpf = this.searchCpf.replace(/\D/g, ''); // Remove all non-numeric characters
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Add first dot
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Add second dot
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Add dash before last two digits
      this.searchCpf = cpf;
    },
    viewPessoa(id) {
      this.$router.push(`/visualizacao/${id}`);
    }
  }
};
</script>

<style scoped>
.search-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.search-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.search-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

input:focus {
  border-color: #007bff;
}

.search-button {
  grid-column: span 2;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.results-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.result-item {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #e9ecef;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.result-item:hover {
  background-color: #d6d6d6;
}
</style>
