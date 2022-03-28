<template>
  <div v-if="circleLogin && loginComplete === false" class="font">
    現在ログイン中です
  </div>
  <div v-else>
    <div v-if="userCheck === false" class="question">
      <div>どのサークルに所属しているのかを登録しましたか？</div>
      <button class="yes-btn" v-on:click="selectYes">はい</button>
      <button class="no-btn" v-on:click="selectNo">いいえ</button>
    </div>
    <div
      v-else-if="userCheck === true && registerCircleCheck == false"
      class="font"
    >
      <div v-if="memberDataPushed">すでに登録完了しています</div>
      <div v-else>
        <div v-if="registerComplete" class="font">
          <div>登録完了しました。</div>
          <div>下のリンクから戻って下さい</div>
          <router-link to="/" class="return-link">Home</router-link>
        </div>
        <div v-else>
          <div class="title">
            このサイトに登録されているサークルの中でどのサークルに所属しているのかを登録してください
          </div>
          <div class="item">学校名</div>
          <select
            name="university"
            id="university"
            v-on:change="selectCircle"
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
          <div class="item">サークル名</div>
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
            <button v-on:click="userRegister" class="decide-btn">
              ユーザー登録
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="userCheck === true && registerCircleCheck == true">
      <div v-if="circleLoginState" class="font">
        <div>ログイン成功です。</div>
        <div>下のリンクから戻って下さい</div>
        <router-link to="/" class="return-link">Home</router-link>
      </div>
      <div v-else-if="loginComplete && circleLoginState === false" class="font">
        <div>ログイン失敗です</div>
        <div>再度登録してください。</div>
        <router-link to="/" class="return-link">Home</router-link>
      </div>
      <div v-else>
        <div class="title">サークルログイン</div>
        <div class="item">学校名</div>
        <select
          name="university"
          id="university"
          v-on:change="selectCircle"
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
        <div class="item">サークル名</div>
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
          <button v-on:click="userCircleLogin" class="decide-btn">
            サークルログイン
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore"
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
      memberDataPushed: false, //サークルにユーザーの情報がすでに入っているのかを判別する変数
      circleLoginState: false, //サークルログインができたかどうかを判別する変数
      circleLoginName: "", //どのサークルにログインしたのかを確認する変数
      selectUniversity: "", //どの大学を選んでいるのかを確認する変数
      userCheck: false, //ユーザーがどのサークルに所属しているのかを登録したか確認する変数
      registerCircleCheck: false, //どのサークルに所属しているのかを登録したか確認する変数
      registerComplete: false, //どのサークルに所属しているのかを登録が完了したのか判別する変数
      loginComplete: false, //サークルログインの動作が一通り完了したかどうかを判別する変数
      universityKey: "", //現在どこの大学がselectされているのかを示す変数
      circleKey: "", //現在どこのサークルがselectされているのかを示す変数
      userData: null, //登録したユーザー情報を格納する変数
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
    async userCircleLogin() {
      if (this.userName !== "" && this.email !== "" && this.userId !== "") {
        const userData = await getDoc(doc(db, "userData", this.userId))
        this.userData = userData.data()
        for (let i = 0; i < this.circleKey.memberData.length; i++) {
          if (
            this.circleKey.memberData[i].userName === this.userName &&
            this.circleKey.memberData[i].usermail === this.email
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
    async userRegister() {
      if (this.userName !== "" && this.email !== "" && this.userId !== "") {
        const user = await getDoc(doc(db, "userData", this.userId))
        this.userData = user.data()
        for (let i = 0; i < this.circleKey.memberData.length; i++) {
          if (
            this.circleKey.memberData[i].userName === this.userName &&
            this.circleKey.memberData[i].usermail === this.email
          ) {
            this.memberDataPushed = true
            break
          } else if (i === this.circleKey.memberData.length - 1) {
            this.userData.registerCircle.push({
              universityName: this.universityKey,
              circleName: this.circleKey.name,
              schedule: this.circleKey.schedule,
              text: this.circleKey.text,
            })
            this.circleKey.memberData.push({
              userName: this.userName,
              usermail: this.email,
              userId: this.userId,
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
            updateDoc(doc(db, "userData", this.userId), {
              registerCircle: this.userData.registerCircle,
            })
            this.registerComplete = true
            break
          }
        }
      } else {
        alert("ユーザーログインしてください")
      }
    },
  },
}
</script>

<style>
.font {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
}

.question {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  margin-bottom: 2%;
  font-size: 30px;
}

.yes-btn {
  margin-right: 0.5%;
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  border-radius: 4px;
  color: #ffffff;
  background-image: linear-gradient(to right, #f83600 0%, #f9d423 100%);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.29);
  border-bottom: solid 3px black;
}

.yes-btn:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  border-bottom: none;
}

.no-btn {
  margin-left: 0.5%;
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  border-radius: 4px;
  color: #ffffff;
  background-image: linear-gradient(
    -225deg,
    #22e1ff 0%,
    #1d8fe1 48%,
    #625eb1 100%
  );
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.29);
  border-bottom: solid 3px black;
}

.no-btn:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  border-bottom: none;
}

.title {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  font-size: 40px;
  background: radial-gradient(
    circle 248px at center,
    #16d9e3 0%,
    #30c7ec 47%,
    #46aef7 100%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.return-link {
  font-size: 40px;
  background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.item {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  width: auto;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  margin-bottom: 2em;
  position: relative;
  margin: 3em 0 2em;
  color: #1e7aca; /* フォント色 */
}

.item::before {
  position: absolute;
  content: "";
  display: block;
  width: 100%;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    #1e7aca 0%,
    rgba(255, 255, 255, 0) 100%
  );
  bottom: 0;
  left: 0;
  z-index: 0;
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
.decide-btn {
  margin-top: 1%;
  margin-bottom: 5%;
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(
    -225deg,
    #22e1ff 0%,
    #1d8fe1 48%,
    #625eb1 100%
  );
  transition: 0.4s;
}

.decide-btn:hover {
  background-image: linear-gradient(
    -225deg,
    #22e1ff 0%,
    #1d8fe1 32%,
    #625eb1 70%
  );
}
</style>
