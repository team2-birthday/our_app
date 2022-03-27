<template>
  <div>
    <head>
      <link
        href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        rel="stylesheet"
      />
      <!--アイコン画像にリンク-->
    </head>
    <div class="circle-edit-page">
      <div v-if="registerComplete" class="edit-complete">
        <div>編集が完了しました</div>
        <div>下のリンクから戻って下さい</div>
        <router-link to="/" class="return-link">Home</router-link>
      </div>
      <div v-else>
        <div class="first-detail">
          <div class="detail">
            <div class="item">学校名</div>
            <div>{{ universityName }}</div>
          </div>
          <div class="detail">
            <div class="item">サークル名</div>
            <div>{{ circleName }}</div>
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
          <div class="item">登録した日程とその日の活動場所</div>
          <div v-for="(data, index) in activeData" v-bind:key="index">
            {{ data.date }}:{{ data.place }}
          </div>
        </div>
        <div>
          <div class="item">サークルメンバー</div>
          <div v-for="(member, index) in memberData" v-bind:key="index">
            {{ member.userName }}
            <button v-on:click="memberDelete(index)" class="delete-btn">
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
          class="edit-btn"
          v-on:click="registerCircle"
          v-bind:disabled="registerJudge"
        >
          編集完了
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore"
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
      userData: null, //登録したユーザー情報を格納する変数
      userDeletecount: 0, //ユーザーを削除した回数をカウントする変数
      userDeleteData: [], //削除するユーザーのデータを格納
    }
  },
  methods: {
    async memberDelete(member) {
      const user = await getDoc(
        doc(db, "userData", this.memberData[member].userId)
      )
      this.userData = user.data()
      // メンバーは0人以下にならない
      if (this.memberData.length > 1) {
        if (
          this.memberData[member].userName === this.userData.userName &&
          this.memberData[member].usermail === this.userData.userMail
        ) {
          for (let i = 0; i < this.userData.registerCircle.length; i++) {
            if (
              this.userData.registerCircle[i].universityName ===
                this.universityName &&
              this.userData.registerCircle[i].circleName ===
                this.circleLoginName
            ) {
              this.userData.registerCircle.splice(i, 1)
              this.memberData.splice(member, 1)
              this.userDeletecount++
              this.userDeleteData.push(this.userData)
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
    async registerCircle() {
      if (this.registerPassword === this.password) {
        await setDoc(
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
        if (this.userDeletecount > 0) {
          for (let i = 0; i < this.userDeletecount; i++) {
            console.log(
              this.userDeleteData[i].userId,
              this.userDeleteData[i].registerCircle
            )
            await updateDoc(
              doc(db, "userData", this.userDeleteData[i].userId),
              {
                registerCircle: this.userDeleteData[i].registerCircle,
              }
            )
          }
        }
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
    this.$emit("myPageStates", true)
    const circleEditData = await getDoc(
      doc(
        collection(db, "univ", this.universityName, "circle"),
        this.circleLoginName
      )
    )
    this.circleData = circleEditData.data()
    this.activeData = this.circleData.schedule
    this.circleName = this.circleData.name
    this.number = this.circleData.number
    this.text = this.circleData.text
    this.memberData = this.circleData.memberData
    this.registerPassword = this.circleData.password
  },
  unmounted() {
    this.$emit("myPageStates", false)
    this.$emit("circleEditing", false)
  },
}
</script>

<style>
.edit-complete {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
}

.return-link {
  font-size: 40px;
  background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.circle-edit-page {
  padding-top: 1%;
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

.edit-btn {
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
  transition: 0.4s;
  margin: 1%;
}

.edit-btn:hover {
  background-image: linear-gradient(#6795fd 0%, #67ceff 70%);
}
</style>
