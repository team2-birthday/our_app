<template>
  <div class="header">
    <div class="login-prodact-name">
      <div class="prodact-name">プロダクト名</div>
      <div class="login">
        <div>
          <router-link to="/registerUser" class="user-register"
            >ユーザー登録</router-link
          >
          <UserLogin
            v-bind:circleLogin="circleLogin"
            v-bind:userName="userName"
            v-bind:email="email"
            v-bind:myPageOpen="myPageOpen"
            v-on:userDataUpgrade="userDataUpgrade"
          ></UserLogin>
        </div>
        <div v-if="circleLogin">
          <div class="circle-login">サークル:{{ circleLoginName }}</div>
          <button
            v-on:click="circleLogout"
            v-bind:disabled="circleEditCheck"
            class="circle-logout-btn"
          >
            サークルログアウト
          </button>
        </div>
      </div>
    </div>
    <div class="router-link">
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/showcircle">show</router-link>
        <router-link to="/registerCircle">サークル登録</router-link>
        <router-link to="/circleLogin"
          >自分の所属しているサークルにログイン</router-link
        >
        <div class="circle-edit" v-if="userName.length > 0 && email.length > 0">
          <router-link to="/MyPage">マイページ</router-link>
        </div>
        <div class="circle-edit" v-if="circleLogin">
          <router-link to="/circleEdit">サークル内容の編集</router-link>
        </div>
      </nav>
    </div>
  </div>
  <router-view
    v-on:myPageStates="myPageStates"
    v-on:circleEditing="circleEditing"
    v-on:circleLoginData="circleLoginDataMove"
    v-bind:circleLoginName="circleLoginName"
    v-bind:circleLogin="circleLogin"
    v-bind:universityName="universityName"
    v-bind:userName="userName"
    v-bind:email="email"
    v-bind:userId="userId"
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
      userName: "",
      email: "",
      userId: "",
      circleEditCheck: false, //サークル編集しているのかを確認する編集
      circleLogin: false,
      circleLoginName: "", //どこのサークルにログインしたかを表示する変数
      universityName: "", //どこの大学なのかを示す変数
      myPageOpen: false, //myPage開いている間はユーザーログアウトさせないようにするための変数
    }
  },
  methods: {
    userDataUpgrade(displayName, emailAddress, uid) {
      this.userName = displayName
      this.email = emailAddress
      this.userId = uid
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
    //マイページを開いてる間はユーザーログアウトできないようにするための関数
    myPageStates(open) {
      this.myPageOpen = open
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
}

.header {
  height: auto;
  width: 100%;
  z-index: 100;
  position: fixed; /* ウィンドウを基準に画面に固定 */
}

.login-prodact-name {
  background: linear-gradient(#05fbff, #1e00ff);
  width: 100%;
  height: auto;
  display: flex;
  align-items: center; /*上下中央揃え*/
}

.router-link {
  display: flex;
}

nav {
  display: flex;
  align-items: center; /*上下中央揃え*/
  border-left: 2px solid black;
  border-bottom: 2px solid black;
  margin-left: auto;
}

a {
  padding-left: 2%;
  padding-right: 2%;
  text-decoration: none; /* リンクの下線を消す */
}

.prodact-name {
  color: white;
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  font-size: 37px;
  padding-left: 1%;
  margin: 1%;
}

.login {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  color: white;
  font-size: 13px;
  margin: 1%;
  margin-left: auto;
}

.user-register {
  color: white;
}

.circle-login {
  margin: 1%;
}

.circle-logout-btn {
  background: transparent;
  border: none;
  color: white;
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #0039f3;
}

.circle-edit {
  display: inline;
}

.router-view {
  padding-top: 250px;
  z-index: 0;
}
</style>
