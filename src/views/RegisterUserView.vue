<template>
  <div>
    <head>
      <link
        href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        rel="stylesheet"
      />
      <!--アイコン画像にリンク-->
    </head>
    <div
      class="register-user"
      v-if="userName.length === 0 && email.length === 0"
    >
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
    <div v-else class="register-user">
      <div>現在ログイン中です</div>
      <router-link to="/">Home</router-link>
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
import { setDoc, doc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  props: {
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  data() {
    return {
      password: "", //編集時に入力するパスワードの設定に使う変数
      typeChange: "password", //inputの属性を管理する変数
      typeChangeCheck: true, //input属性を切り替える変数
      iconType: "fas fa-eye",
      userNameNow: "",
      emailNow: "",
      useridNow: "",
      userCircleRegister: [],
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
          this.useridNow = result.user.uid
          setDoc(doc(db, "userData", this.useridNow), {
            userName: this.userNameNow,
            userMail: this.emailNow,
            userId: this.useridNow,
            password: this.password,
            registerCircle: this.userCircleRegister,
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
