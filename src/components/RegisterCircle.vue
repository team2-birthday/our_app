<template>
  <head>
    <link
      href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
      rel="stylesheet"
    />
    <!--アイコン画像にリンク-->
  </head>
  <div class="register-circle">
    <div v-if="registerComplete">
      <div>登録が完了しました</div>
      <div>下のリンクから戻って下さい</div>
      <router-link to="/">home</router-link>
    </div>
    <div v-else>
      <div class="attention">登録前にログインしてください</div>
      <div class="first-detail">
        <div class="detail">
          <div class="item">学校名</div>
          <select
            name="university"
            id="university"
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
        </div>
        <div class="detail">
          <div class="item">サークル名</div>
          <input
            type="text"
            v-model="circleName"
            placeholder="サークル名"
            required
          />
          <div class="error-message">※ 入力必須です</div>
        </div>
        <div class="detail">
          <div class="item">サークルの所属している人数</div>
          <input type="number" v-model="number" placeholder="人数" required />
          <div class="error-message">※ 入力必須です</div>
        </div>
      </div>
      <div>
        <div class="item">説明文</div>
        <textarea
          type="text"
          v-model="text"
          rows="10"
          class="explanation"
          placeholder="ここにサークルの詳細を入力してください"
          required
        />
        <div class="error-message">※ 入力必須です</div>
      </div>
      <div>
        <div class="item">活動日程と活動場所</div>
        <div>
          <input type="date" class="schedule" v-model="schedule" required />
          <input
            type="text"
            class="schedule"
            v-model="location"
            placeholder="活動場所"
            required
          />
          <div>
            <button
              v-on:click="activePush"
              v-bind:disabled="inputCheck"
              class="schedule-register-btn"
            >
              日程と場所登録
            </button>
          </div>
          <div class="input-lack" v-bind:class="{ lackcheck: lackCheck }">
            ※ 入力必須です
          </div>
        </div>
        <div class="item">現在登録した日程とその日の活動場所（削除可能）</div>
        <div v-for="(data, index) in activeData" v-bind:key="index">
          {{ data.date }}:{{ data.place }}
          <button v-on:click="datePlaceDelete(index)" class="delete-btn">
            削除
          </button>
        </div>
      </div>
      <div>
        <div class="item">パスワード</div>
        <div>※ 編集時に使います</div>
        <input
          v-bind:type="typeChange"
          v-model="password"
          minlength="8"
          maxlength="15"
          size="15"
          pattern="[a-zA-Z0-9]+"
          placeholder="8~15文字"
          required
        />
        <i id="icon" v-bind:class="iconType" v-on:click="passwordCheck"></i
        ><!--アイコン表示場所-->
        <div class="error-message">※ 入力必須です</div>
      </div>
      <button
        class="register-btn"
        v-on:click="registerCircle"
        v-bind:disabled="registerJudge"
      >
        登録
      </button>
    </div>
  </div>
</template>

<script>
import { collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  props: {
    universityList: {
      type: Array,
      required: true,
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
      activeData: [], //活動日程と活動場所を格納する配列
      number: "",
      text: "",
      circleName: "",
      universityKey: "", //現在どこの大学がselectされているのかを示す変数
      location: "", //活動場所をpushする変数
      schedule: "", //活動日程をpushする変数
      registerComplete: false, //サークルの登録したかどうかを確かめる変数
      memberData: [], //会員のデータを格納する変数
      password: "", //編集時に入力するパスワードの設定に使う変数
      typeChange: "password", //inputの属性を管理する変数
      typeChangeCheck: true, //input属性を切り替える変数
      iconType: "fas fa-eye",
      userData: null, //登録したユーザー情報を格納する変数
    }
  },
  methods: {
    activePush() {
      if (this.schedule != "" && this.locaton != "") {
        this.activeData.push({ date: this.schedule, place: this.location })
        //昇順に並べる
        this.activeData = [...this.activeData].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      }
      this.schedule = ""
      this.location = ""
    },
    datePlaceDelete(data) {
      this.activeData.splice(data, 1)
    },
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
    async registerCircle() {
      if (this.userName === "" && this.email === "" && this.userId === "") {
        alert("ログインしてから登録して下さい。")
      } else {
        const userData = await getDoc(doc(db, "userData", this.userId))
        this.userData = userData.data()
        this.userData.registerCircle.push({
          universityName: this.universityKey,
          circleName: this.circleName,
        })
        this.memberData.push({
          userName: this.userName,
          usermail: this.email,
          userId: this.userId,
        })
        await updateDoc(doc(db, "userData", this.userId), {
          registerCircle: this.userData.registerCircle,
        })
        await setDoc(
          doc(
            collection(db, "univ", this.universityKey, "circle"),
            this.circleName
          ),
          {
            number: this.number,
            name: this.circleName,
            schedule: this.activeData,
            text: this.text,
            memberData: this.memberData,
            password: this.password,
          }
        )
        this.number = ""
        this.circleName = ""
        this.activeData.splice(0)
        this.text = ""
        this.password = ""
        this.registerComplete = true
      }
    },
  },
  computed: {
    registerJudge() {
      if (
        this.universityKey === "" ||
        this.number <= 0 ||
        this.circleName === "" ||
        this.text === "" ||
        this.activeData.length === 0 ||
        this.password.length < 8 ||
        this.password.length > 15
      ) {
        return true
      } else {
        return false
      }
    },
    inputCheck() {
      if (this.location === "" || this.schedule === "") {
        return true
      } else {
        return false
      }
    },
    lackCheck() {
      if (this.activeData.length > 0) {
        return true
      } else {
        return false
      }
    },
  },
  unmounted() {
    this.userData = ""
  },
}
</script>

<style>
.register-circle {
  padding-top: 15%;
}

.attention {
  font-size: 30px;
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  width: 100%;
  margin-bottom: 1%;
  line-height: 0.95em;
  font-weight: bold;
  color: transparent;
  background: linear-gradient(
    90deg,
    #0091ea 0% 30%,
    #00b0ff 40% 60%,
    #80d8ff 70% 100%
  );
  background-clip: text;
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

.first-detail {
  width: 100%;
  margin-bottom: 1%;
}

.detail {
  display: inline-block;
  margin-right: 7%;
  margin-left: 7%;
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

/* :invalid時だけ隣の要素を表示 */
textarea:invalid + .error-message {
  display: block;
}

/* :invalid時だけ隣の要素を表示 */
select:invalid + .error-message {
  display: block;
}

.input-lack {
  font-size: 12px;
  color: #ff7676;
}

.schedule {
  margin-left: 0.5%;
  margin-right: 0.5%;
}

.schedule-register-btn {
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
  transition: 0.4s;
  margin: 1%;
}

.schedule-register-btn:hover {
  background-image: linear-gradient(#6795fd 0%, #67ceff 70%);
}

.lackcheck {
  display: none;
}

.delete-btn {
  display: inline-block;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(#fd6767 0%, #df3131 100%);
  transition: 0.4s;
}
.delete-btn:hover {
  background-image: linear-gradient(#fd6767 0%, #df3131 70%);
}

.register-btn {
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
  transition: 0.4s;
  margin: 1%;
}

.register-btn:hover {
  background-image: linear-gradient(#6795fd 0%, #67ceff 70%);
}

.explanation {
  resize: none;
  display: inline-block;
  width: 80%;
  padding: 10px;
  border: 1px solid #999;
  box-sizing: border-box;
  background-color: white;
  margin: 0.5em 0;
  line-height: 1.5;
  font-family: Century;
}
</style>
