const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})

// vue.config.js
module.exports = {
  devServer: {
    proxy: 'http://localhost:8000', // URL do seu back-end Laravel
  },
};
