<template>
  <div class="deposit">
    <Header>
      <div>
        <img class="icon" :src="require('../assets/logo.svg')">
      </div>
    </Header>
    <div class="content center">
      <div id="back">
        <img
          src="../assets/left-arrow.svg"
          alt="btnBack"
          class="btnBack"
          @click="handleHome">
        <b class="text">Depósito</b>
        <form class="deposit-form" @submit.prevent="submitDeposit">
          <div class="input-control">
            <br>
            <label for="value-input">Informe a <b>quantia</b> desejada</label>
            <br>
            <input
              autofocus
              v-model.number="value"
              type="number"
              id="value-input"
              required
              name="value"
              class="input"
              placeholder="$KA 0,00">
          </div>
          <p v-if="!verifyOk1">Por favor digite um valor acima de $KA10,00</p>
          <p v-if="!verifyOk2">Por favor digite um valor abaixo de $KA15.000,00</p>
          <div class="actions">
            <b type="navigate" class="btn" @click="add10">
              +10
            </b>
            <b type="navigate" class="btn" @click="add500">
              +500
            </b>
            <b type="navigate" class="btn" @click="add1000">
              +1000
            </b>
            <b type="navigate" class="btn" @click="add5000">
              +5000
            </b>
          </div><br>
          <div class="actions">
            <button type="submit" class="center">
              Depositar
            </button>
          </div>
        </form>
      </div>
    </div>
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
        firebase.firestore().doc(`users/${uid}`).update({
          balance: firebase.firestore.FieldValue.increment(this.value)
        })
        const statement = {
          type: 'Depósito',
          value: this.value,
          createAt: new Date()
        }
        firebase.firestore().doc(`cryptoStatement/${uid}`).update({
          statement: firebase.firestore.FieldValue.arrayUnion(statement)
        })
        alert('Depósito efetuado com sucesso')
        this.value = null
      }
    },

    add10 () {
      this.value += 10.00
    },

    add500 () {
      this.value += 500.00
    },

    add1000 () {
      this.value += 1000.00
    },

    add5000 () {
      this.value += 5000.00
    },

    handleHome () {
      this.value = null
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
  }

  .deposit > .content {
    width: 334pt;
    margin-top: 60px;
    margin-bottom: 60px;
    max-width: 95%;
  }

  #back {
    background-color: #4076AD;
    text-align: left;
    margin-bottom: 20px;
    border-radius: 1em;
    display: block;
    padding-top: .4em;
    text-align: center;
  }

  #back > .text {
    color: #fff;
    margin-left: -5pt;
  }

  #back > .btnBack {
    cursor: pointer;
    float: left;
    margin-left: 5pt;
  }

  .center {
    margin: auto;
  }

  .deposit-form {
    display: block;
    background-color: #FFF;
    border-radius: 1em;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 2pt;
  }

  .input-control {
    margin-bottom: 2px;
  }

  .input-control > label {
    display: block;
    color: #000;
    font-size: 20px;
  }

  .btn {
    justify-content: center;
    margin: 0 10pt;
    color: #333333;
    font-size: 20px;
    cursor: pointer;
  }

  .input-control > .input {
    height: 75px;
    width: 215pt;
    border-width: 0;
    background: #fff;
    font-family: 'Roboto';
    font-size: 50px;
    padding: 0 25px;
    color: #333333;
    text-align: center;
  }

  .input-control > .input:focus {
    background: #F2F2F2;
  }

  .deposit-form > .actions > button[type="submit"] {
    background-color: #FA7268;
    border: 0;
    border-radius: 0.7em;
    color: #FFF;
    font-weight: bold;
    font-size: 18px;
    width: 100%;
    height: 50pt;
    cursor: pointer;
  }
</style>
