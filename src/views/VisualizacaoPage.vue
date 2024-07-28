<template>
  <div class="details-container">
    <h1>Visualização de Pessoa</h1>
    <div v-if="pessoa">
      <div class="info-group">
        <p><strong>Nome:</strong> {{ pessoa.nome }}</p>
        <p><strong>Nome Social:</strong> {{ pessoa.nome_social }}</p>
        <p><strong>CPF:</strong> {{ pessoa.cpf }}</p>
        <p><strong>Nome do Pai:</strong> {{ pessoa.nome_pai }}</p>
        <p><strong>Nome da Mãe:</strong> {{ pessoa.nome_mae }}</p>
        <p><strong>Telefone:</strong> {{ pessoa.telefone }}</p>
        <p><strong>Email:</strong> {{ pessoa.email }}</p>
      </div>
      <h2>Endereços</h2>
      <div class="address-list">
        <div class="address-item" v-for="endereco in pessoa.enderecos" :key="endereco.id">
          <p><strong>{{ endereco.tipo }}:</strong></p>
          <p>{{ endereco.logradouro }}, {{ endereco.numero }} - {{ endereco.bairro }}, {{ endereco.cidade }} - {{ endereco.estado }} (CEP: {{ endereco.cep }})</p>
          <p v-if="endereco.complemento"><strong>Complemento:</strong> {{ endereco.complemento }}</p>
                  <button @click="goToAddressHistory(endereco.id)">Ver Histórico</button>

          <button @click="openModal(endereco)">Atualizar Endereço</button>
        </div>
      </div>
      <button @click="goToAddAddress">Adicionar Outro Endereço</button>
    </div>
    <div v-else>
      <p>Carregando...</p>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Atualizar Endereço</h2>
        <form @submit.prevent="updateAddress">
          <div class="form-group">
            <label>Tipo</label>
            <select v-model="modalData.tipo" required>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>
          <div class="form-group">
            <input v-model="modalData.cep" @input="formatCEP" @change="fetchAddress" placeholder="CEP" required>
          </div>
          <div class="form-group">
            <input v-model="modalData.logradouro" :readonly="isLogradouroFetched" placeholder="Logradouro">
          </div>
          <div class="form-group">
            <input v-model="modalData.numero" placeholder="Número">
          </div>
          <div class="form-group">
            <input v-model="modalData.bairro" :readonly="isBairroFetched" placeholder="Bairro">
          </div>
          <div class="form-group">
            <input v-model="modalData.cidade" :readonly="isCidadeFetched" placeholder="Cidade">
          </div>
          <div class="form-group">
            <input v-model="modalData.estado" :readonly="isEstadoFetched" placeholder="Estado">
          </div>
          <div class="form-group">
            <input v-model="modalData.complemento" placeholder="Complemento">
          </div>
          <button type="submit">Atualizar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pessoa: null,
      showModal: false,
      modalData: {},
      isLogradouroFetched: false,
      isBairroFetched: false,
      isCidadeFetched: false,
      isEstadoFetched: false
    };
  },
  mounted() {
    this.fetchPessoa();
  },
  methods: {
    goToAddressHistory(enderecoId) {
      this.$router.push(`/enderecos/${enderecoId}/historico`);
    },
    fetchPessoa() {
      const pessoaId = this.$route.params.id; // Obtém o ID da pessoa da URL
      fetch(`http://localhost:8000/api/pessoas/${pessoaId}`) // URL relativa ao proxy configurado
        .then(response => response.json())
        .then(data => {
          this.pessoa = data;
        })
        .catch(error => {
          console.error('Erro ao buscar a pessoa:', error);
        });
    },
    goToAddAddress() {
      const pessoaId = this.$route.params.id;
      this.$router.push({ name: 'AddAddress', params: { id: pessoaId } });
    },
    openModal(endereco) {
       const pessoaId = this.$route.params.id;
      this.modalData = { ...endereco , pessoa_id: pessoaId};
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalData = {};
    },
    updateAddress() {
      fetch(`http://localhost:8000/api/enderecos/${this.modalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.modalData)
      })
      .then(response => response.json())
      .then(() => {
        alert('Endereço atualizado com sucesso!');
        this.closeModal();
        this.fetchPessoa(); // Refresh the person data to reflect the updated address
      })
      .catch(error => {
        console.error('Erro ao atualizar endereço:', error);
        alert('Ocorreu um erro ao atualizar o endereço.');
      });
    },
    fetchAddress() {
      const cep = this.modalData.cep.replace(/\D/g, ''); // Remove special characters
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json`)
          .then(response => response.json())
          .then(data => {
            if (!data.erro) {
              this.modalData.logradouro = data.logradouro;
              this.isLogradouroFetched = true;
              this.modalData.bairro = data.bairro;
              this.isBairroFetched = true;
              this.modalData.cidade = data.localidade;
              this.isCidadeFetched = true;
              this.modalData.estado = data.uf;
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
      this.modalData.logradouro = '';
      this.isLogradouroFetched = false;
      this.modalData.bairro = '';
      this.isBairroFetched = false;
      this.modalData.cidade = '';
      this.isCidadeFetched = false;
      this.modalData.estado = '';
      this.isEstadoFetched = false;
    },
    formatCEP() {
      let cep = this.modalData.cep.replace(/\D/g, ''); // Remove all non-numeric characters
      cep = cep.replace(/(\d{5})(\d)/, '$1-$2'); // Add dash after the fifth digit
      this.modalData.cep = cep;
    }
  }
};
</script>

<style scoped>
.details-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  text-align: center;
  color: #333;
}

.info-group p {
  font-size: 18px;
  margin: 10px 0;
}

.address-list {
  margin-top: 20px;
}

.address-item {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.address-item p {
  margin: 5px 0;
}

button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

strong {
  color: #007bff;
}

/* Modal Styles */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
}

.modal-content h2 {
  text-align: center;
  color: #333;
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

button[type="submit"] {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
