<template>
  <div class="home">
    <Header>
      <div>
        <img class="icon" :src="require('../assets/logo.svg')">
      </div>
    </Header>
    <div id="top">
      <p id="userName">Olá, {{this.user}}</p>
      <p id="btnSignOut" @click="signOut">
          Sair
      </p>
    </div>
    <div class="balance">
      <p>Saldo disponível</p>
      <p id="balance">$KA {{this.balance}}</p>
    </div>
    <div v-if="!statements.length"
      class="statement">
      <br>
      <p>Você ainda não possui lançamentos!</p>
      <p>Realize um deposito agora mesmo!</p>
      <br>
    </div>
    <div v-else
      class="statement">
      <p>Últimos movimentos</p>
      <div
        id="statement"
        v-for="statement in statements"
        v-bind:key="statement.id">
        <div v-if="statement.type === 'Transferência enviada'">
          <br>
          Data = {{statement.createAt}} <br>
          Tipo = {{statement.type}} <br>
          Valor = $KA {{statement.value}}<br>
          Para = {{statement.recipient}}
          <br>
        </div>
        <div v-else-if="statement.type === 'Transferência recebida'">
          <br>
          Data = {{statement.createAt}} <br>
          Tipo = {{statement.type}} <br>
          Valor = $KA {{statement.value}}<br>
          De = {{statement.recipient}}
          <br>
        </div>
        <div v-else>
          <br>
          Data = {{statement.createAt}} <br>
          Tipo = {{statement.type}} -
          Valor = $KA {{statement.value}}
          <br>
        </div>
      </div>
    </div>
    <div class="actions">
      <button type="navigate" id="deposit-button" class="center" @click="handleDeposit">
        <img class="ico" src="../assets/piggy-bank.svg" alt="deposit-ico">
        Depositar
      </button><br>
      <button type="navigate" id="pay-button" class="center" @click="handlePay">
        <img class="ico" src="../assets/pay.svg" alt="pay-ico">
        Pagar
      </button><br>
      <button type="navigate" id="transfer-button" class="center" @click="handleTransfer">
        <img class="ico" src="../assets/surface1.svg" alt="transfer-ico">
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
    return {
      balance: null,
      user: '',
      statements: []
    }
  },
  components: {
    Header
  },
  mounted () {
    const uid = firebase.auth().currentUser.uid
    firebase.firestore().doc(`users/${uid}`).get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!')
        } else {
          this.user = doc.data().email
          this.balance = (doc.data().balance)
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
    firebase.firestore().doc(`cryptoStatement/${uid}`).get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!')
        } else {
          this.statements = doc.data().statement.reverse()
          for (var i = 0; i < this.statements.length; i++) {
            this.statements[i].createAt = this.statements[i].createAt.toDate().toLocaleString('pt-BR')
          }
        }
      }).catch(error => {
        throw new Error(error)
      })
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
      this.$router.push({ path: '/transfer' })
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

  .home > .balance {
    background-color: #fff;
    width: 334pt;
    color: #333333;
    margin: 1em auto;
    border-radius: 5pt;
    padding-top: 1pt;
    padding-left: 10pt;
    text-align: left;
    max-width: 90%;
  }

  .home > .balance > #balance {
    margin-top: -15px;
    margin-bottom: -5px;
    font-size: 45px;
  }

  .home > .statement {
    background-color: #fff;
    width: 334pt;
    color: #000;
    margin: 1em auto;
    border-radius: 5pt;
    padding-top: 1pt;
    padding-left: 10pt;
    text-align: left;
    overflow: auto;
    max-width: 90%;
    max-height: 35%;
  }

  .home > .actions > button[type="navigate"] {
    background-color: #FA7268;
    border: 0;
    border-radius: 0.7em;
    color: #FFF;
    font-size: 20px;
    width: 345pt;
    height: 50pt;
    cursor: pointer;
    max-width: 95%;
    text-align: right;
    display: block;
    margin: 0 auto;
    padding: 20px 15px;
  }

  .ico {
    float: left;
  }

  #top {
    width: 334pt;
    height: 25pt;;
    color: #fff;
    margin: 0 auto;
    padding: 0 10pt;
    text-align: left;
    max-width: 90%;
  }
  #userName {
    float: left;
    font-weight: bold;
  }

  #btnSignOut {
    cursor: pointer;
    float: right;
  }

</style>
