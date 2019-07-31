<template>
  <div class="transfer">
    <Header>
      <div slot="action-left" class="icon-button" tag="button" @click="handleHome">
        Voltar
      </div>
      <div>
        <img class="icon" :src="require('../assets/logo.svg')">
      </div>
    </Header>
    <!-- <label for="from-input">Para quem você deseja enviar?</label>
          <br>
          <input v-model="benefited" type="text" id="from-input" required name="from" class="input" placeholder="fulano@email.com"> -->
        <button type="action" @click="buscar">buscar user</button>
     <form class="transfer-form" @submit.prevent="submitTransfer">
        <div class="input-control">
          <label for="value-input">Informe a quantia desejada</label>
          <br>
          <input v-model.number="value" type="number" id="value-input" required name="value" class="input" placeholder="$KA 0,00">
          <br>
        </div>
        <p v-if="verifyOk1">Por favor digite um valor acima de $KA10,00</p>
        <p v-if="verifyOk2">Por favor digite um valor abaixo de $KA15.000,00</p>
        <p v-if="verifyOk3">Saldo insuficiente para realizar operação</p>
        <br>
        <div class="actions">
          <button type="submit" class="center">
            Pagar
          </button>
        </div>

      </form>
  </div>
</template>

<script>
import Header from '@/components/Header'
import * as firebase from 'firebase'

export default {
  name: 'transfer',
  data: () => ({
    verifyOk1: false,
    verifyOk2: false,
    verifyOk3: false,
    value: null,
    balance: null,
    benefited: ''
  }),
  components: {
    Header
  },

  methods: {
    buscar () {
      firebase.firestore().collection('users')
        .where('email', '==', "camilomenuch@gmail.com").get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
            alert('user não encontrado')
          } else {
            console.log('usuario beneficiado antes da busca ' + this.benefited)

            this.benefited = doc.data().uid

            console.log('usuario beneficiado antes da busca ' + this.benefited)
            alert('user encontrado')
          }
        })
    },

    submitTransfer () {
      const uid = firebase.auth().currentUser.uid
      console.log('teste ' + this.balance)
      console.log('teste 2 ' + this.benefited)
      if (this.value < 10) {
        this.verifyOk1 = true
        this.verifyOk2 = false
        this.verifyOk2 = false
      } else if (this.value > 15000) {
        this.verifyOk1 = false
        this.verifyOk2 = true
        this.verifyOk3 = false
      } else {
        firebase.firestore().doc(`users/${uid}`).get()
          .then(doc => {
            if (!doc.exists) {
              console.log('No such document!')
            } else {
              this.balance = doc.data().balance
              if (this.balance < this.value) {
                this.verifyOk1 = false
                this.verifyOk2 = false
                this.verifyOk3 = true
              } else {
                this.verifyOk1 = false
                this.verifyOk2 = false
                this.verifyOk3 = false
                firebase.firestore().doc(`users/${uid}`).update({
                  balance: firebase.firestore.FieldValue.increment(-this.value)
                })
                // firebase.firestore().doc(`users/${benefitedUid}`).update({
                //   balance: firebase.firestore.FieldValue.increment(this.value)
                // })

                // SALVANDO HISTORICO DE MOVIMENTAÇÃO
                const docId = firebase.firestore().collection('movement').doc().id
                firebase.firestore()
                  .collection('movement')
                  .doc(docId).set(
                    { id: docId,
                      uid,
                      type: 'pay',
                      value: this.value,
                      createOn: new Date()
                    })
                alert('Deposito efetuado com sucesso')
              }
              console.log('dentro do doc => ' + this.balance)
            }
          })
          .catch(err => {
            console.log('Error getting document', err)
          })
      }
    },

    handleHome () {
      this.value = null
      this.balance = null
      this.$router.push({ path: '/home' })
    }
  }
}

</script>

<style scoped>
  .transfer {
    overflow: auto;
    background-color: #333333;
    background-size: cover;
    width: 100%;
    height: 100%;
    color: #fff;
  }

  .transfer > .content {
    width: 320px;
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .transfer-form > .actions > button[type="submit"] {
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
