<template>
  <div class="transfer">
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
        <b class="text">Transferência</b>
        <form class="transfer-form" @submit.prevent="submitTransfer">
          <div class="input-control">
            <br>
            <label for="from-input">Para <b>quem</b> você deseja enviar?</label>
            <input
              autofocus
              v-model="recipient"
              type="text"
              id="from-input"
              required
              name="from"
              class="input"
              placeholder="fulano@email.com">
            <br>
            <br>
            <input type="checkbox" v-model="saveContact">
            <label for="">Salvar usuário como contato</label>
            <br>
            <br>
            <label for="">Contatos: </label>
            <select
              v-model="recipient"
              class="contacts">
              <option v-for="contact in contacts" :key="contact">{{ contact }}</option>
            </select>
            <br>
            <br>
            <label for="value-input">Informe a <b>quantia</b> desejada</label>
            <input
              v-model.number="value"
              type="number" id="value-input"
              required
              name="value"
              class="input"
              placeholder="$KA 0,00">
            <br>
          </div>
          <b class="alert" v-if="verifyOk1">Por favor digite um valor acima de $KA10,00</b>
          <b class="alert" v-if="verifyOk2">Por favor digite um valor abaixo de $KA15.000,00</b>
          <b class="alert" v-if="verifyOk3">Saldo insuficiente para realizar operação</b>
          <br><br>
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
              Transferir
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
  name: 'transfer',
  data: () => ({
    verifyOk1: false,
    verifyOk2: false,
    verifyOk3: false,
    value: null,
    balance: null,
    recipient: '',
    rUid: null,
    saveContact: false,
    contacts: []
  }),
  components: {
    Header
  },

  mounted () {
    const uid = firebase.auth().currentUser.uid
    firebase.firestore().doc(`users/${uid}`).get()
      .then(doc => {
        if (!doc.exists) {
          alert('ERROR')
        } else {
          this.contacts = doc.data().contacts
        }
      })
  },

  methods: {
    async submitTransfer () {
      const uid = firebase.auth().currentUser.uid
      const email = firebase.auth().currentUser.email
      await firebase.firestore().collection('users')
        .where('email', '==', this.recipient).get()
        .then(snapshot => {
          snapshot.docs.map(doc => {
            if (!doc.exists) {
              alert('Usuario destino não encontrado')
              this.rUid = null
            } else {
              this.rUid = (doc.data().uid)
            }
          })
        })
      if (!this.rUid) {
        alert('Usuário destino não encontrado')
        this.recipient = ''
      } else if (uid === this.rUid) {
        alert('Impossível transferir para sua própria conta')
        this.recipient = ''
      } else {
        if (this.saveContact) {
          firebase.firestore().doc(`users/${uid}`).update({
            contacts: firebase.firestore.FieldValue.arrayUnion(this.recipient)
          })
        }
        if (this.value < 10) {
          this.verifyOk1 = true
          this.verifyOk2 = false
          this.verifyOk3 = false
        } else if (this.value > 15000) {
          this.verifyOk1 = false
          this.verifyOk2 = true
          this.verifyOk3 = false
        } else {
          await firebase.firestore().doc(`users/${uid}`).get()
            .then(doc => {
              if (!doc.exists) {
                alert('ERROR')
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
                  firebase.firestore().doc(`users/${this.rUid}`).update({
                    balance: firebase.firestore.FieldValue.increment(this.value)
                  })

                  // SALVANDO HISTORICO DE MOVIMENTAÇÃO
                  const statement = {
                    type: 'Transferência enviada',
                    value: this.value,
                    createAt: new Date(),
                    recipientUid: this.rUid,
                    recipient: this.recipient
                  }
                  console.log(statement)
                  firebase.firestore().doc(`cryptoStatement/${uid}`).update({
                    statement: firebase.firestore.FieldValue.arrayUnion(statement)
                  })
                  const statement2 = {
                    type: 'Transferência recebida',
                    value: this.value,
                    createAt: new Date(),
                    recipientUid: uid,
                    recipient: email
                  }
                  console.log(statement2)
                  firebase.firestore().doc(`cryptoStatement/${this.rUid}`).update({
                    statement: firebase.firestore.FieldValue.arrayUnion(statement2)
                  })
                  alert('Transferência efetuada com sucesso')
                  this.value = null
                  this.recipient = null
                }
              }
            })
            .catch(err => {
              console.log('Error getting document', err)
            })
        }
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
      this.balance = null
      this.recipient = ''
      this.rUid = null
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
  }

  .transfer > .content {
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

  .transfer-form {
    display: block;
    background-color: #FFF;
    border-radius: 1em;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 2pt;
  }

  .transfer-form > .alert {
    color: #FA7268
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
    width: 334pt;
    border-width: 0;
    background: #fff;
    font-family: 'Roboto';
    font-size: 50px;
    padding: 0 25px;
    color: #333333;
    text-align: center;
    max-width: 85%;
  }

  #from-input {
    height: 50px;
    font-size: 20px;
  }

  .input-control > .input:focus {
    background: #F2F2F2;
  }

  .input-control > input[type="checkbox"]{
    float: none;
  }

  .transfer-form > .actions > button[type="submit"] {
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
