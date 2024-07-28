<template>
  <div class="history-container">
    <h1>Histórico de Endereços</h1>
    <table class="history-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Pessoa ID</th>
          <th>Tipo</th>
          <th>CEP</th>
          <th>Logradouro</th>
          <th>Número</th>
          <th>Bairro</th>
          <th>Cidade</th>
          <th>Estado</th>
          <th>Data de Criação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="historico in historicos" :key="historico.id">
          <td>{{ historico.id }}</td>
          <td>{{ historico.pessoa_id }}</td>
          <td>{{ historico.tipo }}</td>
          <td>{{ historico.cep }}</td>
          <td>{{ historico.logradouro }}</td>
          <td>{{ historico.numero }}</td>
          <td>{{ historico.bairro }}</td>
          <td>{{ historico.cidade }}</td>
          <td>{{ historico.estado }}</td>
          <td>{{ new Date(historico.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      historicos: []
    };
  },
  mounted() {
    this.fetchHistorico();
  },
  methods: {
    fetchHistorico() {
      const enderecoId = this.$route.params.id;
      fetch(`http://localhost:8000/api/enderecos/${enderecoId}/historico`)
        .then(response => response.json())
        .then(data => {
          this.historicos = data;
        })
        .catch(error => {
          console.error('Erro ao buscar histórico de endereços:', error);
        });
    }
  }
};
</script>

<style scoped>
.history-container {
  max-width: 800px;
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

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th, .history-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.history-table th {
  background-color: #007bff;
  color: white;
}

.history-table tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
