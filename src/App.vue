<template>
  {{ circleLoginName }}
  <UserLogin
    v-bind:circleLogin="circleLogin"
    v-bind:userName="userName"
    v-bind:email="email"
    v-on:userDataUpgrade="userDataUpgrade"
  ></UserLogin>
  <div v-if="circleLogin">
    <button v-on:click="circleLogout" v-bind:disabled="circleEditCheck">
      サークルログアウト
    </button>
  </div>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/showcircle">show</router-link> |
    <router-link to="/registerCircle">サークル登録</router-link> |
    <router-link to="/circleLogin"
      >自分の所属しているサークルにログイン</router-link
    >
    <div class="circle-edit" v-if="circleLogin">
      |
      <router-link to="/circleEdit">サークル内容の編集</router-link>
    </div>
  </nav>
  <router-view
    v-on:circleEditing="circleEditing"
    v-on:circleLoginData="circleLoginDataMove"
    v-bind:circleLoginName="circleLoginName"
    v-bind:universityName="universityName"
    v-bind:circleLogin="circleLogin"
    v-bind:userName="userName"
    v-bind:email="email"
  />
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
      userName: "",
      email: "",
      circleEditCheck: false, //サークル編集しているのかを確認する編集
      circleLogin: false,
      circleLoginName: "", //どこのサークルにログインしたかを表示する変数
      universityName: "", //どこの大学なのかを示す変数
    }
  },
  methods: {
    userDataUpgrade(displayName, emailAddress) {
      this.userName = displayName
      this.email = emailAddress
    },
    circleLoginDataMove(
      currentCircleLogin,
      currentCircleLoginName,
      selectUniversity
    ) {
      this.circleLogin = currentCircleLogin
      this.circleLoginName = currentCircleLoginName
      this.universityName = selectUniversity
    },
    circleLogout() {
      this.circleLogin = false
      this.circleLoginName = ""
      this.universityName = ""
    },
    circleEditing(circleEdit) {
      this.circleEditCheck = circleEdit
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

.circle-edit {
  display: inline;
}
</style>
