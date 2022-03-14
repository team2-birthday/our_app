<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
  <CircleLogin></CircleLogin>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"
import CircleLogin from "@/components/CircleLogin.vue"

export default {
  name: "HomeView",
  components: {
    HelloWorld,
    CircleLogin,
  },
}
</script>
