<template>
  <div class="login">
    <div class="content center">
      <img class="logo" :src="require('../assets/logo.svg')" alt="Logo"/>
      <form class="login-form" @submit.prevent="submitLogin">
        <div class="input-control">
          <label for="email-input">E-mail</label>
          <input v-model="email" type="email" id="email-input" required name="email" class="input" placeholder="Digite seu e-mail">
        </div>

        <div class="input-control">
          <label for="password-input">Senha</label>
          <input v-model="password" type="password" id="password-input" required name="password" class="input" placeholder="Digite sua senha">
        </div>
        <p v-if="!authOk">Usuário e/ou senha incorretos</p>
        <div class="actions">
          <button type="submit" class="center">
            Entrar
          </button>
        </div>

        <br>

        <div class="actions">
          <p>Novo aqui?
            <router-link to="/create_account">
              Criar conta
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: '',
    authOk: true
  }),
  methods: {
    submitLogin () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ path: '/home' })
        }).catch(() => {
          this.authOk = false
        })
    }
  }
}
</script>

<style scoped>
  .login {
    overflow: auto;
    background: url("../assets/fundo.png") no-repeat center center fixed;
    background-color: #333333;
    background-size: cover;
    width: 100%;
    height: 100%;
  }

  .login > .content {
    width: 320px;
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .center {
    display: block;
    margin: 0 auto;
  }

  .login-form {
    margin-top: 78px;
  }

  .input-control {
    margin-bottom: 20px;
  }

  .input-control > label {
    display: block;
  }

  .input-control > .input {
    height: 48px;
    width: calc(100% - 50px);
    border-radius: 10px;
    border-width: 0;
    background: #FFF;
    font-family: 'Roboto';
    font-size: 15px;
    padding: 0 25px;
  }

  .input-control > .input:focus {
    background: #F2F2F2;
  }

  .login-form > .actions > button[type="submit"] {
    background-color: #FA7268;
    border: 0;
    border-radius: 100px;
    color: #FFF;
    font-weight: bold;
    font-size: 18px;
    width: 160px;
    height: 48px;
    cursor: pointer;
  }

  .login-form > .actions > button[type="submit"]:hover {
      background-color: #FF6347;
  }

  .logo {
    margin: 0 auto;
    display: block;
  }

  .login > .content > .login-form > .input-control > label {
    display: none;
  }

  p {
    color: #FFF;
  }
</style>
