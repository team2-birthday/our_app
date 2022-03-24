<template>
  <div>
    <div>
      {{ userName }}
    </div>
    <div>
      {{ email }}
    </div>
  </div>
  <div v-if="userLogin === false">
    <button v-on:click="logInGoogle">ログイン</button>
  </div>
  <div v-else>
    <button v-on:click="logOutGoogle">ログアウト</button>
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
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  data() {
    return {
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
          this.$emit(
            "userDataUpgrade",
            result.user.displayName,
            result.user.email
          )
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
            const logoutString = ""
            this.$emit("userDataUpgrade", logoutString, logoutString)
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
