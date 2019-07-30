<template>
  <div class="home">
    <Header>
      <div slot="action-left" class="icon-button" tag="button" @click="signOut">
        Sair
      </div>
      <div>
        <img class="icon" :src="require('../assets/logo.svg')">
      </div>
    </Header>
    <h1>TESTE</h1>
    <div class="actions">
      <button type="navigate" id="deposit-button" class="center" @click="handleDeposit">
        Depositar
      </button>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import firebase from 'firebase'

export default {
  name: 'home',
  data () {
  },
  components: {
    Header
  },

  methods: {
    signOut () {
      firebase.auth().signOut().then(() => {
        alert('Desconectado com sucesso!')
        this.$router.push('/login')
      }).catch(error => {
        alert('Erro ao desconectar. \n\n' + error)
      })
    },

    handleDeposit () {
      this.$router.push({ path: '/deposit' })
    }
  }
}

</script>

<style scoped>
  .home {
    overflow: auto;
    background-color: #333333;
    background-size: cover;
    width: 100%;
    height: 100%;
    color: #fff;
  }
</style>
