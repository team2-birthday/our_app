<template>
  <div>
    <div>
      <div>
        <div class="user-login">
          {{ userName }}
        </div>
        <div class="user-login">
          {{ email }}
        </div>
      </div>
      <div v-if="userLogin === false">
        <div>
          <button v-on:click="logInGoogle" class="login-logout-btn">
            ログイン
          </button>
        </div>
      </div>
      <div v-else>
        <button
          v-on:click="logOutGoogle"
          v-bind:disabled="myPageOpen"
          class="login-logout-btn"
        >
          ログアウト
        </button>
      </div>
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
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  props: {
    myPageOpen: {
      type: Boolean,
      require: true,
    },
    circleLogin: {
      type: Boolean,
      require: true,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  data() {
    return {
      userLogin: false,
      typeChangeCheck: true, //input属性を切り替える変数
      userData: null, //登録したユーザー情報を格納する変数
      userGetId: "",
      userGetName: "",
      userGetMail: "",
    }
  },
  methods: {
    async logInGoogle() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      await signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result)
          credential.accessToken
          result.user
          this.userGetId = result.user.uid
          this.userGetName = result.user.displayName
          this.userGetMail = result.user.email
        })
        .catch((error) => {
          error.code
          error.message
          error.email
          GoogleAuthProvider.credentialFromError(error)
        })
      await getDoc(doc(db, "userData", this.userGetId))
        .then((user) => {
          this.userData = user.data()
          if (
            this.userData.userName === this.userGetName &&
            this.userData.userMail === this.userGetMail &&
            this.userData.userId === this.userGetId
          ) {
            this.$emit(
              "userDataUpgrade",
              this.userGetName,
              this.userGetMail,
              this.userGetId
            )
            this.userLogin = true
          }
        })
        .catch(() => {
          alert("登録が完了していません。")
          this.logOutGoogle()
        })
    },
    logOutGoogle() {
      const auth = getAuth()
      if (this.circleLogin) {
        this.$emit("circleLogout")
      }
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          const logoutString = ""
          this.$emit(
            "userDataUpgrade",
            logoutString,
            logoutString,
            logoutString
          )
          this.userLogin = false
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
.user-login {
  margin: 2%;
}

.login-logout-btn {
  background: transparent;
  border: none;
  color: white;
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
}
</style>
