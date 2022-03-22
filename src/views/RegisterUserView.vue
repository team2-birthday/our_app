<template>
  <head>
    <link
      href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
      rel="stylesheet"
    />
    <!--アイコン画像にリンク-->
  </head>
  <div class="register-user">
    <div>ログインしていないユーザーはまず登録お願いします</div>
    <div>パスワードを決めて下さい</div>
    <input
      v-bind:type="typeChange"
      v-model="password"
      minlength="8"
      maxlength="15"
      size="15"
      pattern="[a-zA-Z0-9]+"
      title="パスワードは(8~15文字)半角英数字で入力してください。"
      required
    />
    <i id="icon" v-bind:class="iconType" v-on:click="passwordCheck"></i
    ><!--アイコン表示場所-->
    <div class="error-message">※ 入力必須です</div>
    <div>
      <button v-on:click="registerUser">登録</button>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { setDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  data() {
    return {
      password: "", //編集時に入力するパスワードの設定に使う変数
      typeChange: "password", //inputの属性を管理する変数
      typeChangeCheck: true, //input属性を切り替える変数
      iconType: "fas fa-eye",
      userNameNow: "",
      emailNow: "",
      userCircleRegister: [],
      users: [], //登録したユーザー情報を格納する配列
    }
  },
  methods: {
    //パスワードの確認を行えるようにする関数
    passwordCheck() {
      this.typeChangeCheck = !this.typeChangeCheck
      if (this.typeChangeCheck) {
        this.typeChange = "password"
        this.iconType = "fas fa-eye"
      } else {
        this.typeChange = "text"
        this.iconType = "fas fa-eye-slash"
      }
    },
    //ユーザー登録を行う関数
    registerUser() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result)
          credential.accessToken
          result.user
          this.userNameNow = result.user.displayName
          this.emailNow = result.user.email
          console.log(this.userNameNow, this.emailNow)
          this.users.push({
            userName: this.userNameNow,
            userMail: this.emailNow,
            password: this.password,
            registerCiercle: this.userCircleRegister,
          })
          setDoc(doc(db, "userData", "users"), {
            userData: this.users,
          })
        })
        .catch((error) => {
          error.code
          error.message
          error.email
          GoogleAuthProvider.credentialFromError(error)
        })
      signOut(auth)
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          console.error(error)
        })
    },
  },
  async mounted() {
    const userData = await getDoc(doc(db, "userData", "users"))
    this.users = userData.data().userData
  },
  unmounted() {
    this.users.splice(0)
  },
}
</script>

<style>
.register-user {
  padding-top: 250px;
}
.error-message {
  font-size: 12px;
  color: #ff7676;
  display: none; /* 非表示に */
}
/* :invalid時だけ隣の要素を表示 */
input:invalid + .error-message {
  display: block;
}
</style>
