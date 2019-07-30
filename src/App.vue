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
html,body{
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  text-align: center;
  color: #2c3e50;
}

#app a {
    color: #FFF ;
    text-decoration:none;
    font-weight: bold;
}
</style>
