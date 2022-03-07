<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
  <RegisterCircle></RegisterCircle>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"
import RegisterCircle from "@/components/RegisterCircle.vue"

export default {
  name: "Home",
  components: {
    HelloWorld,
    RegisterCircle,
  },
}
</script>
