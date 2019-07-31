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
      </button><br>
      <button type="navigate" id="pay-button" class="center" @click="handlePay">
        Pagar
      </button><br>
      <button type="navigate" id="transfer-button" class="center" @click="handleTransfer">
        Transferir
      </button><br>
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
    },

    handlePay () {
      this.$router.push({ path: '/pay' })
    },

    handleTransfer () {
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

  .home > .actions > button[type="navigate"] {
    background-color: #FA7268;
    border: 0;
    border-radius: 100px;
    color: #FFF;
    font-weight: bold;
    font-size: 18px;
    width: 300px;
    height: 48px;
    cursor: pointer;
    margin: 10px;
  }
</style>
