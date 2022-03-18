<template>
  <div v-if="circleLogin">現在ログイン中です</div>
  <div v-else>
    <div v-if="userCheck === false">
      <div>どのサークルに所属しているのかを登録しましたか？</div>
      <div class="register-check" v-on:click="selectYes">はい</div>
      /
      <div class="register-check" v-on:click="selectNo">いいえ</div>
    </div>
    <div v-else-if="userCheck === true && registerCircleCheck == false">
      <div v-if="memberDataPushed">すでに登録完了しています</div>
      <div v-else>
        <div v-if="registerComplete">
          <div>登録完了しました。</div>
          <div>下のリンクから戻って下さい</div>
          <router-link to="/">home</router-link>
        </div>
        <div v-else>
          <div>
            このサイトに登録されているサークルの中でどのサークルに所属しているのかを登録してください
          </div>
          <div>学校名</div>
          <select
            name="university"
            id="university"
            v-on:click="selectCircle"
            v-model="universityKey"
            required
          >
            <option value="">--学校名を選んでください--</option>
            <option
              v-for="(university, index) in universityList"
              v-bind:key="index"
              v-bind:value="university"
            >
              {{ university }}
            </option>
          </select>
          <div class="error-message">※ 入力必須です</div>
          <div>サークル名</div>
          <select name="circle" id="circle" v-model="circleKey">
            <option value="" selected>
              --自分が登録するサークル名を選んでください--
            </option>
            <option
              v-for="(registerCircle, index) in registerCircleList"
              v-bind:key="index"
              v-bind:value="registerCircle"
            >
              {{ registerCircle.name }}
            </option>
          </select>
          <div>
            <button v-on:click="userRegister">ユーザー登録</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="userCheck === true && registerCircleCheck == true">
      <div v-if="loginComplete">
        <div>登録完了しました。</div>
        <div>下のリンクから戻って下さい</div>
        <router-link to="/">home</router-link>
      </div>
      <div v-else>
        <div>サークルログイン</div>
        <div>学校名</div>
        <select
          name="university"
          id="university"
          v-on:click="selectCircle"
          v-model="universityKey"
          required
        >
          <option value="">--学校名を選んでください--</option>
          <option
            v-for="(university, index) in universityList"
            v-bind:key="index"
            v-bind:value="university"
          >
            {{ university }}
          </option>
        </select>
        <div class="error-message">※ 入力必須です</div>
        <div>サークル名</div>
        <select name="circle" id="circle" v-model="circleKey">
          <option value="" selected>
            --自分が登録するサークル名を選んでください--
          </option>
          <option
            v-for="(registerCircle, index) in registerCircleList"
            v-bind:key="index"
            v-bind:value="registerCircle"
          >
            {{ registerCircle.name }}
          </option>
        </select>
        <div>
          <button v-on:click="userCircleLogin">サークルログイン</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase.js"
export default {
  props: {
    universityList: {
      type: Array,
      required: true,
    },
    circleLogin: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      memberDataPushed: false, //サークルにユーザーの情報がすでに入っているのかを判別する変数
      circleLoginState: false, //サークルログインができたかどうかを判別する変数
      circleLoginName: "", //どのサークルにログインしたのかを確認する変数
      selectUniversity: "", //どの大学を選んでいるのかを確認する変数
      userCheck: false, //ユーザーがどのサークルに所属しているのかを登録したか確認する変数
      registerCircleCheck: false, //どのサークルに所属しているのかを登録したか確認する変数
      registerComplete: false, //どのサークルに所属しているのかを登録が完了したのか判別する変数
      loginComplete: false, //サークルログインが完了したかどうかを判別する変数
      universityKey: "", //現在どこの大学がselectされているのかを示す変数
      circleKey: "", //現在どこのサークルがselectされているのかを示す変数
      registerCircleList: [],
    }
  },
  methods: {
    selectYes() {
      this.userCheck = true
      this.registerCircleCheck = true
    },
    selectNo() {
      this.userCheck = true
      this.registerCircleCheck = false
    },
    selectCircle: async function () {
      this.registerCircleList.splice(0)
      if (this.universityKey != "") {
        const registerUniversity = await getDocs(
          collection(db, "univ", this.universityKey, "circle")
        )
        await registerUniversity.forEach((doc) => {
          this.registerCircleList.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      }
    },
    //サークルログインする関数
    userCircleLogin() {
      const auth = getAuth()
      const user = auth.currentUser
      if (user !== null) {
        for (let i = 0; i < this.circleKey.memberData.length; i++) {
          if (
            this.circleKey.memberData[i].userName === user.displayName &&
            this.circleKey.memberData[i].usermail === user.email
          ) {
            this.circleLoginState = true
            this.circleLoginName = this.circleKey.name
            this.selectUniversity = this.universityKey
            this.$emit(
              "circleLoginData",
              this.circleLoginState,
              this.circleLoginName,
              this.selectUniversity
            )
            break
          }
        }
        this.loginComplete = true
      } else {
        alert("ユーザーログインしてください")
      }
    },
    //ユーザーの情報をサークルに保存しておく関数
    userRegister() {
      const auth = getAuth()
      const user = auth.currentUser
      if (user !== null) {
        for (let i = 0; i < this.circleKey.memberData.length; i++) {
          if (
            this.circleKey.memberData[i].userName === user.displayName &&
            this.circleKey.memberData[i].usermail === user.email
          ) {
            this.memberDataPushed = true
            break
          } else if (i === this.circleKey.memberData.length - 1) {
            this.circleKey.memberData.push({
              userName: user.displayName,
              usermail: user.email,
            })
            updateDoc(
              doc(
                collection(db, "univ", this.universityKey, "circle"),
                this.circleKey.name
              ),
              {
                memberData: this.circleKey.memberData,
              }
            )
            this.registerComplete = true
          }
        }
      } else {
        alert("ログインしてください")
      }
    },
  },
}
</script>

<style>
.register-check {
  display: inline;
}
.error-message {
  font-size: 12px;
  color: #ff7676;
  display: none; /* 非表示に */
}

/* :invalid時だけ隣の要素を表示 */
select:invalid + .error-message {
  display: block;
}
</style>
