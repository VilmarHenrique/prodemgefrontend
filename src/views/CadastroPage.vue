<template>
  <div class="form-container">
    <h1>Cadastro de Pessoa</h1>
    <form @submit.prevent="submit" class="form-grid">
      <div class="form-group">
        <input v-model="nome" placeholder="Nome" required>
      </div>
      <div class="form-group">
        <input v-model="nomeSocial" placeholder="Nome Social">
      </div>
      <div class="form-group">
        <input v-model="cpf" @input="formatCPF" placeholder="CPF" required>
      </div>
      <div class="form-group">
        <input v-model="nomePai" placeholder="Nome do Pai">
      </div>
      <div class="form-group">
        <input v-model="nomeMae" placeholder="Nome da Mãe">
      </div>
      <div class="form-group">
        <input v-model="telefone" @input="formatTelefone" placeholder="Telefone">
      </div>
      <div class="form-group">
        <input v-model="email" placeholder="Email">
      </div>
      <div class="form-group">
        <input v-model="cep" @input="formatCEP" @change="fetchAddress" placeholder="CEP" required>
      </div>
      <div class="form-group">
        <input v-model="logradouro" :readonly="isLogradouroFetched" placeholder="Logradouro">
      </div>
      <div class="form-group">
        <input v-model="bairro" :readonly="isBairroFetched" placeholder="Bairro">
      </div>
      <div class="form-group">
        <input v-model="cidade" :readonly="isCidadeFetched" placeholder="Cidade">
      </div>
      <div class="form-group">
        <input v-model="complemento" placeholder="Complemento">
      </div>
      <div class="form-group">
        <input v-model="numero" placeholder="Número">
      </div>
      <div class="form-group">
        <input v-model="estado" :readonly="isEstadoFetched" placeholder="Estado">
      </div>
      <div class="form-group">
        <select v-model="tipoEndereco" required>
          <option disabled value="">Tipo de Endereço</option>
          <option value="Comercial">Comercial</option>
          <option value="Residencial">Residencial</option>
        </select>
      </div>
      <button type="submit" class="submit-button">Cadastrar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nome: '',
      nomeSocial: '',
      cpf: '',
      nomePai: '',
      nomeMae: '',
      telefone: '',
      email: '',
      cep: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      complemento: '',
      numero: '',
      tipoEndereco: '',

      isLogradouroFetched: false,
      isBairroFetched: false,
      isCidadeFetched: false,
      isEstadoFetched: false
    };
  },
  methods: {
    submit() {
      fetch('http://localhost:8000/api/pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: this.nome,
          nome_social: this.nomeSocial,
          cpf: this.cpf,
          nome_pai: this.nomePai,
          nome_mae: this.nomeMae,
          telefone: this.telefone,
          email: this.email
        })
      })
      .then(response => response.json())
      .then(userData => {
        const userId = userData.id;
        fetch('http://localhost:8000/api/enderecos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pessoa_id: userId,
            cep: this.cep,
            logradouro: this.logradouro,
            bairro: this.bairro,
            cidade: this.cidade,
            estado: this.estado,
            tipo: this.tipoEndereco,
            numero: this.numero,
            complemento: this.complemento
          })
        })
        .then(() => {
          alert('Pessoa e endereço cadastrados com sucesso!');
          this.resetForm();
          this.$router.push('/');
        })
        .catch(error => {
          console.error('Erro ao cadastrar endereço:', error);
        });
      })
      .catch(error => {
        console.error('Erro ao cadastrar pessoa:', error);
        alert('Ocorreu um erro: ' + error.message);
      });
    },
    resetForm() {
      this.nome = '';
      this.nomeSocial = '';
      this.cpf = '';
      this.nomePai = '';
      this.nomeMae = '';
      this.telefone = '';
      this.email = '';
      this.cep = '';
      this.logradouro = '';
      this.bairro = '';
      this.cidade = '';
      this.estado = '';
      this.complemento = '';
      this.numero = '';
      this.tipoEndereco = '';
      this.isLogradouroFetched = false;
      this.isBairroFetched = false;
      this.isCidadeFetched = false;
      this.isEstadoFetched = false;
    },
    fetchAddress() {
      const cep = this.cep.replace(/\D/g, ''); // Remove special characters
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json`)
          .then(response => response.json())
          .then(data => {
            if (!data.erro) {
              this.logradouro = data.logradouro;
              this.isLogradouroFetched = true;
              this.bairro = data.bairro;
              this.isBairroFetched = true;
              this.cidade = data.localidade;
              this.isCidadeFetched = true;
              this.estado = data.uf;
              this.isEstadoFetched = true;
            } else {
              alert('CEP não encontrado.');
              this.resetAddress();
            }
          })
          .catch(error => {
            console.error('Erro ao buscar endereço:', error);
            this.resetAddress();
          });
      } else {
        this.resetAddress();
      }
    },
    resetAddress() {
      this.logradouro = '';
      this.isLogradouroFetched = false;
      this.bairro = '';
      this.isBairroFetched = false;
      this.cidade = '';
      this.isCidadeFetched = false;
      this.estado = '';
      this.isEstadoFetched = false;
    },
    formatCPF() {
      let cpf = this.cpf.replace(/\D/g, ''); // Remove all non-numeric characters
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Add first dot
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Add second dot
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Add dash before last two digits
      this.cpf = cpf;
    },
    formatCEP() {
      let cep = this.cep.replace(/\D/g, ''); // Remove all non-numeric characters
      cep = cep.replace(/(\d{5})(\d)/, '$1-$2'); // Add dash after the fifth digit
      this.cep = cep;
    },
    formatTelefone() {
      let telefone = this.telefone.replace(/\D/g, ''); // Remove all non-numeric characters
      telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2'); // Add parentheses around the first two digits
      telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2'); // Add space after the fourth digit and dash after the eighth digit
      this.telefone = telefone;
    }
  }
};
</script>

<style scoped>
.form-container {
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

input:focus, select:focus {
  border-color: #007bff;
}

.submit-button {
  grid-column: span 2;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
