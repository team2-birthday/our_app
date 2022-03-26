<template>
  <div>
    <div
      class="register-user"
      v-if="userName.length === 0 && email.length === 0"
    >
      <div v-if="registerUserComplete === false">
        <div>ログインしていないユーザーはまず登録お願いします</div>
        <div>
          <button v-on:click="registerUser">登録</button>
        </div>
      </div>
      <div v-else>
        <div>登録完了しました。</div>
        <div>下のリンクから戻って下さい。</div>
        <router-link to="/">Home</router-link>
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
      registerUserComplete: false, //ユーザー登録が完了したかどうかを判断する変数
      typeChangeCheck: true, //input属性を切り替える変数
      userNameNow: "",
      emailNow: "",
      useridNow: "",
      userCircleRegister: [],
    }
  },
  methods: {
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
      this.registerUserComplete = true
    },
  },
}
</script>

<style>
.register-user {
  padding-top: 10%;
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
