<template>
  <div class="deposit">
    <Header>
      <div slot="action-left" class="icon-button" tag="button" @click="handleHome">
        Voltar
      </div>
      <div>
        <img class="icon" :src="require('../assets/logo.svg')">
      </div>
    </Header>
     <form class="login-form" @submit.prevent="submitDeposit">
        <div class="input-control">
          <label for="value-input">Informe a quantia desejada</label>
          <br>
          <input v-model="value" type="value" id="value-input" required name="value" class="input" placeholder="$KA 0,00">
        </div>
        <p v-if="!verifyOk1">Por favor digite um valor acima de $KA10,00</p>
        <p v-if="!verifyOk2">Por favor digite um valor abaixo de $KA15.000,00</p>
        <br>
        <div class="actions">
          <button type="submit" class="center">
            Depositar
          </button>
        </div>

      </form>
  </div>
</template>

<script>
import Header from '@/components/Header'
import * as firebase from 'firebase'

export default {
  name: 'deposit',
  data: () => ({
    verifyOk1: true,
    verifyOk2: true,
    value: null
  }),
  components: {
    Header
  },

  methods: {
    submitDeposit () {
      const uid = firebase.auth().currentUser.uid
      if (this.value < 10) {
        this.verifyOk1 = false
        this.verifyOk2 = true
      } else if (this.value > 15000) {
        this.verifyOk1 = true
        this.verifyOk2 = false
      } else {
        this.verifyOk1 = true
        this.verifyOk2 = true
        // firebase.firestore()
        //   .collection('users')
      }
    },

    handleHome () {
      this.value = 0.00
      this.$router.push({ path: '/home' })
    }
  }
}

</script>

<style scoped>
  .deposit {
    overflow: auto;
    background-color: #333333;
    background-size: cover;
    width: 100%;
    height: 100%;
    color: #fff;
  }
</style>
