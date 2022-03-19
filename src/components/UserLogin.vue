<template>
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
      <button v-on:click="logInGoogle">ログイン</button>
    </div>
    <div v-else>
      <button v-on:click="logOutGoogle">ログアウト</button>
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
export default {
  props: {
    circleLogin: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      userName: "",
      email: "",
      userLogin: false,
    }
  },
  methods: {
    logInGoogle() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result)
          credential.accessToken
          result.user
          this.userName = result.user.displayName
          this.email = result.user.email
          this.userLogin = true
        })
        .catch((error) => {
          error.code
          error.message
          error.email
          GoogleAuthProvider.credentialFromError(error)
        })
    },
    logOutGoogle() {
      const auth = getAuth()
      if (this.circleLogin) {
        alert("まずサークルログアウトしてください")
      } else {
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            this.userName = ""
            this.email = ""
            this.userLogin = false
          })
          .catch((error) => {
            // An error happened.
            console.error(error)
          })
      }
    },
  },
}
</script>

<style>
.user-login {
  margin: 2%;
}
</style>
