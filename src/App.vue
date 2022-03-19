<template>
  <div class="header">
    <div class="prodact-name">プロダクト名</div>
    <div class="login">
      <div>
        <UserLogin v-bind:circleLogin="circleLogin"></UserLogin>
      </div>
      <div v-if="circleLogin">
        <div>サークル:{{ circleLoginName }}</div>
        <button v-on:click="circleLogout" v-bind:disabled="circleEditCheck">
          サークルログアウト
        </button>
      </div>
    </div>
  </div>
  <div class="router-link">
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
  </div>
  <router-view
    v-on:circleEditing="circleEditing"
    v-on:circleLoginData="circleLoginDataMove"
    v-bind:circleLoginName="circleLoginName"
    v-bind:universityName="universityName"
    v-bind:circleLogin="circleLogin"
    class="router-view"
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
      circleEditCheck: false, //サークル編集しているのかを確認する編集
      circleLogin: false,
      circleLoginName: "", //どこのサークルにログインしたかを表示する変数
      universityName: "", //どこの大学なのかを示す変数
    }
  },
  methods: {
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
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header {
  background-color: rgb(0, 174, 255);
  position: fixed; /* ウィンドウを基準に画面に固定 */
  width: 100%;
  height: auto;
  z-index: 100;
  display: flex;
  align-items: center; /*上下中央揃え*/
}

.router-link {
  width: 100%;
  display: flex;
  position: fixed;
  margin-top: 100px;
}

nav {
  margin-left: auto;
  z-index: 100;
}

.prodact-name {
  padding-left: 1%;
}

.login {
  padding: 1%;
  margin-left: auto;
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

.router-view {
  padding: 200px;
  z-index: 0;
}
</style>
