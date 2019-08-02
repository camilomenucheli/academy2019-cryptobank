<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {}
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap');

html,body{
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

#app a {
    color: #FFF ;
    text-decoration:none;
    font-weight: bold;
}
</style>
