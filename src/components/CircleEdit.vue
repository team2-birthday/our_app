<template>
  <head>
    <link
      href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
      rel="stylesheet"
    />
    <!--アイコン画像にリンク-->
  </head>
  <div class="circle-edit-page">
    <div v-if="registerComplete">
      <div>編集が完了しました</div>
      <div>下のリンクから戻って下さい</div>
      <router-link to="/">home</router-link>
    </div>
    <div v-else>
      <div>
        <div>学校名</div>
        <div>{{ universityName }}</div>
      </div>
      <div>
        <div>サークル名</div>
        <input
          type="text"
          v-model="circleName"
          placeholder="サークル名"
          required
        />
        <div class="error-message">※ 入力必須です</div>
      </div>
      <div>
        サークルの所属している人数
        <input type="number" v-model="number" placeholder="人数" required />
        <div class="error-message">※ 入力必須です</div>
      </div>
      <div>
        <div>説明文</div>
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
        活動日程と活動場所
        <div>
          <input type="date" v-model="schedule" required />
          <input
            type="text"
            v-model="location"
            placeholder="活動場所"
            required
          />
          <div>
            <button v-on:click="activePush" v-bind:disabled="inputCheck">
              日程と場所登録
            </button>
          </div>
          <div class="input-lack" v-bind:class="{ lackcheck: lackCheck }">
            ※ 入力必須です
          </div>
        </div>
        現在登録した日程とその日の活動場所（削除可能）
        <div v-for="(data, index) in activeData" v-bind:key="index">
          {{ data.date }}:{{ data.place }}
          <button v-on:click="datePlaceDelete(index)" class="delete-btn">
            削除
          </button>
        </div>
      </div>
      <div>
        サークルメンバー
        <div v-for="(member, index) in memberData" v-bind:key="index">
          {{ member.userName }}
          <button v-on:click="memberDelete(index)" class="delete-btn">
            削除
          </button>
        </div>
      </div>
      <div>
        <div>パスワード</div>
        <div>※ 編集時に使います</div>
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
        <div class="error-message">※ 入力必須です</div>
      </div>
      <button v-on:click="registerCircle" v-bind:disabled="registerJudge">
        編集完了
      </button>
    </div>
  </div>
</template>

<script>
import { collection, setDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  props: {
    circleLoginName: {
      type: String,
      require: true,
    },
    universityName: {
      type: String,
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
      activeData: [], //活動日程と活動場所を格納する配列
      number: "",
      text: "",
      circleName: "",
      location: "", //活動場所をpushする変数
      schedule: "", //活動日程をpushする変数
      registerComplete: false, //サークルの登録したかどうかを確かめる変数
      memberData: [], //会員のデータを格納する変数
      circleData: null, //編集するサークルのデータを格納する編集
      registerPassword: "", //サークル登録時のパスワードの格納
      password: "", //編集時に入力するパスワードの設定に使う変数
      typeChange: "password", //inputの属性を管理する変数
      typeChangeCheck: true, //input属性を切り替える変数
      iconType: "fas fa-eye",
      users: [], //登録したユーザー情報を格納する配列
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
    memberDelete(member) {
      if (this.memberData.length > 1) {
        for (let i = 0; i < this.users.length; i++) {
          if (
            this.users[i].userName !== this.userName &&
            this.users[i].userMail !== this.email
          ) {
            if (this.memberData[member].userName === this.users[i].userName) {
              this.users[i].registerCircle.splice(i, 1)
              this.memberData.splice(member, 1)
            }
          }
        }
      }
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
    registerCircle() {
      if (this.registerPassword === this.password) {
        if (this.memberData.length <= 0) {
          this.memberData.push({
            userName: this.userName,
            usermail: this.email,
          })
        }
        setDoc(
          doc(
            collection(db, "univ", this.universityName, "circle"),
            this.circleName
          ),
          {
            number: this.number,
            name: this.circleName,
            schedule: this.activeData,
            text: this.text,
            memberData: this.memberData,
            password: this.registerPassword,
          }
        )
        this.number = ""
        this.circleName = ""
        this.activeData.splice(0)
        this.memberData.splice(0)
        this.text = ""
        this.registerComplete = true
      } else {
        alert("パスワードが違います。")
      }
    },
  },
  computed: {
    registerJudge() {
      if (
        this.universityName === "" ||
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
  async mounted() {
    this.$emit("circleEditing", true)
    const circleEditData = await getDoc(
      doc(
        collection(db, "univ", this.universityName, "circle"),
        this.circleLoginName
      )
    )
    const userData = await getDoc(doc(db, "userData", "users"))
    this.users = userData.data().userData
    this.circleData = circleEditData.data()
    this.activeData = this.circleData.schedule
    this.circleName = this.circleData.name
    this.number = this.circleData.number
    this.text = this.circleData.text
    this.memberData = this.circleData.memberData
    this.registerPassword = this.circleData.password
  },
  unmounted() {
    this.$emit("circleEditing", false)
    this.users.splice(0)
  },
}
</script>

<style>
.circle-edit-page {
  padding-top: 250px;
}
</style>
