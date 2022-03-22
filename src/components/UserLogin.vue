<template>
  <head>
    <link
      href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
      rel="stylesheet"
    />
    <!--アイコン画像にリンク-->
  </head>
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
      <div>パスワード</div>
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
  },
  data() {
    return {
      userLogin: false,
      password: "", //編集時に入力するパスワードの設定に使う変数
      typeChange: "password", //inputの属性を管理する変数
      typeChangeCheck: true, //input属性を切り替える変数
      iconType: "fas fa-eye",
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
    async logInGoogle() {
      await getDoc(doc(db, "userData", "users")).then((user) => {
        this.users = user.data().userData
      })
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      await signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result)
          credential.accessToken
          result.user
          for (let i = 0; i < this.users.length; i++) {
            if (
              this.users[i].userName === result.user.displayName &&
              this.users[i].userMail === result.user.email &&
              this.users[i].password === this.password
            ) {
              this.$emit(
                "userDataUpgrade",
                result.user.displayName,
                result.user.email
              )
              this.userLogin = true
              break
            } else if (i === this.users.length - 1) {
              alert("パスワードが違うか登録が完了していません")
              this.logOutGoogle()
            }
          }
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
