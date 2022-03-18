<template>
  <div>
    <div>
      {{ userName }}
    </div>
    <div>
      {{ email }}
    </div>
  </div>
  <div>
    <button v-on:click="logInGoogle">ログイン</button>
  </div>
  <div>
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
  data() {
    return {
      userName: "",
      email: "",
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
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          this.userName = ""
          this.email = ""
        })
        .catch((error) => {
          // An error happened.
          console.error(error)
        })
    },
  },
}
</script>
