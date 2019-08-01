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
     <form class="deposit-form" @submit.prevent="submitDeposit">
        <div class="input-control">
          <label for="value-input">Informe a quantia desejada</label>
          <br>
          <input v-model.number="value" type="number" id="value-input" required name="value" class="input" placeholder="$KA 0,00">
        </div>
        <p v-if="!verifyOk1">Por favor digite um valor acima de $KA10,00</p>
        <p v-if="!verifyOk2">Por favor digite um valor abaixo de $KA15.000,00</p>
        <br>
        <div class="actions">
          <button type="navigate" class="center" @click="add10">
            +10
          </button>
          <button type="navigate" class="center" @click="add500">
            +500
          </button>
          <button type="navigate" class="center" @click="add1000">
            +1000
          </button>
          <button type="navigate" class="center" @click="add5000">
            +5000
          </button>
        </div><br>
        <div class="actions">
          <button type="submit" class="center">
            Depositar
          </button>
        </div>
      </form>
      <div>
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
        const docId = firebase.firestore().collection('cryptoStatement').doc().id
        firebase.firestore()
          .collection('cryptoStatement')
          .doc(docId).set(
            { id: docId,
              uid,
              type: 'deposit',
              value: this.value,
              createOn: new Date()
            })
          // .then(() => {
          //   alert('Post criado com sucesso!')
          //   this.$router.push('/feed')
          // }).catch(error => {
          //   alert('Erro ao criar post! \n\n' + error)
          // })
        // console.log(this.value)
        // firebase.firestore()
        //   .collection('movement').doc(uid).collection('mov')
        //   .add({
        //     uid,
        //     type: 'deposit',
        //     value: this.value,
        //     createOn: new Date()
        //   })
        alert('Deposito efetuado com sucesso')
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
    color: #fff;
  }

  .deposit > .content {
    width: 320px;
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .deposit-form > .actions > button[type="submit"] {
    background-color: #FA7268;
    border: 0;
    border-radius: 100px;
    color: #FFF;
    font-weight: bold;
    font-size: 18px;
    width: 300px;
    height: 48px;
    cursor: pointer;
  }
</style>
