import Vue from 'vue';
import Router from 'vue-router';
import PesquisaPage from '@/views/PesquisaPage.vue';
import CadastroPage from '@/views/CadastroPage.vue';
import VisualizacaoPage from '@/views/VisualizacaoPage.vue';
import AddAddress from '@/views/AdicionarEndereco.vue';
import EnderecoPorId from '@/views/EnderecoPorId.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'pesquisa',
      component: PesquisaPage
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: CadastroPage
    },
    {
      path: '/visualizacao/:id',
      name: 'visualizacao',
      component: VisualizacaoPage
    },
    {
      path: '/add-address/:id',
      name: 'AddAddress',
      component: AddAddress
    },
    {
      path: '/enderecos/:id/historico',
      component: EnderecoPorId
    }
  ]
});