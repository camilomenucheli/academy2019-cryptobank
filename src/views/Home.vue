<template>
  <div class="home">
    <Header>
      <div slot="action-left" class="icon-button" tag="button" @click="signOut">
        Sair
      </div>
      <div>
        <img class="icon" :src="require('../assets/logo.svg')">
      </div>
      <div slot="action-right" class="icon-button" tag="button" @click="signOut">
        Sair
      </div>
    </Header>
    <h3>Bem vindo, {{this.user}}</h3>
    <div class="balance">
      <p>Saldo disponível</p>
      <p>$KA {{this.balance}}</p>
    </div>
    <div class="balance">
      <p>ultimas transferencias:</p>
      <li v-for="statement in statements" :key="statement.id">
        <p> Tipo = {{statement.type}}</p>
        <p> Valor = $KA{{statement.value}}</p>
        <p> Data = {{statement.createOn}}</p>
      </li>
    </div>
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
    firebase.firestore().collection('cryptoStatement')
      .where('uid', '==', uid)
      .then(snapshot => {
        snapshot.docs.map(doc => {
          console.log(this.statements)
          this.statements.push(doc.data())
        })
      }).catch(error => {
        throw new Error(error)
      })
    // balanceSnapshotListener = firebase.firestore().collection('posts')
    //   .where('userUid', '==', userUid)
    //   .onSnapshot(snapshot => {
    //     snapshot.docChanges().forEach(change => {
    //       if (change.type === 'added') {
    //         this.posts.push(change.doc.data())
    //       }

    //       if (change.type === 'modified') {
    //         const { id } = change.doc.data()
    //         const currentObject = this.posts.filter(post => post.id === id)[0]

    //         this.posts[this.posts.indexOf(currentObject)] = change.doc.data()
    //         this.$forceUpdate()
    //       }

    //       if (change.type === 'removed') {
    //         const { id } = change.doc.data()
    //         const currentObject = this.posts.filter(post => post.id === id)[0]

    //         this.posts.splice(this.posts.indexOf(currentObject), 1)
    //         this.$forceUpdate()
    //       }
    //     })
    //   })
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
    height: 104pt;
    color: #000;
    margin: 1em auto;
    border-radius: 5pt;
    padding-top: 10pt;
    padding-left: 10pt;
    text-align: left
  }

  .home > .actions > button[type="navigate"] {
    background-color: #FA7268;
    border: 0;
    border-radius: 1em;
    color: #FFF;
    font-weight: bold;
    font-size: 18px;
    width: 334pt;
    height: 50pt;
    cursor: pointer;
    margin: 10px;
  }
</style>
