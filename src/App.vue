<template>
  {{ circleLoginName }}
  <UserLogin></UserLogin>
  <div v-if="circleLogin">
    <button v-on:click="circleLogout">サークルログアウト</button>
  </div>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/showcircle">show</router-link> |
    <router-link to="/registerCircle">サークル登録</router-link> |
    <router-link to="/circleLogin"
      >自分の所属しているサークルにログイン</router-link
    >
  </nav>
  <router-view v-on:circleLoginData="circleLoginDataMove" />
</template>

<script>
import UserLogin from "@/components/UserLogin.vue"
export default {
  name: "UserLoginView",
  components: {
    UserLogin,
  },
  data() {
    return {
      circleLogin: false,
      cicleLoginName: "", //どこのサークルにログインしたかを表示する変数
    }
  },
  methods: {
    circleLoginDataMove(currentCircleLogin, currentCircleLoginName) {
      this.circleLogin = currentCircleLogin
      this.circleLoginName = currentCircleLoginName
    },
    circleLogout() {
      this.circleLogin = false
      this.circleLoginName = ""
      console.log(this.circleLoginName)
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
