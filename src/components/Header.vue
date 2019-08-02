<template>
  <header class="header">

    <div class="wrapper-logo">
      <img class="logo" :src="require('../assets/logo.svg')" alt="Logo"/>
    </div>

  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  background: #333333;
  padding: .4em .4em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 334pt;
  height: 65pt;
  margin: auto;
  display: block;
  max-width: 90%;
  margin-top: 10pt;
}
.action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper-logo {
  flex: 1;
}
</style>
