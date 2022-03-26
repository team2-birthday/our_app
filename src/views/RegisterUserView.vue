<template>
  <div>
    <div
      class="register-user"
      v-if="userName.length === 0 && email.length === 0"
    >
      <div v-if="registerUserComplete === false">
        <div>ログインしていないユーザーはまず登録お願いします</div>
        <div>
          <button v-on:click="registerUser" class="register-user-btn">
            登録
          </button>
        </div>
      </div>
      <div v-else>
        <div>{{ userNameNow }}さん登録完了しました。</div>
        <div>下のリンクから戻って下さい。</div>
        <router-link to="/" class="return-link">Home</router-link>
      </div>
    </div>
    <div v-else class="register-user">
      <div>現在ログイン中です</div>
      <router-link to="/" class="return-link">Home</router-link>
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
    async registerUser() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      await signInWithPopup(auth, provider)
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
      await signOut(auth)
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
  padding-top: 2%;
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
}
.return-link {
  font-size: 40px;
  background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
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
.register-user-btn {
  margin-top: 0.5%;
  display: inline-block;
  padding: 7px 20px;
  border-radius: 25px;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(to right, #0acffe 0%, #495aff 100%);
  transition: 0.4s;
}
.register-user-btn:hover {
  background-image: linear-gradient(to right, #0acffe 0%, #495aff 100%);
}
</style>
