<template>
  <div>
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
      <button v-on:click="registerCircle" v-bind:disabled="registerJudge">
        編集完了
      </button>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth"
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
      this.memberDelete.splice(member, 1)
    },
    registerCircle() {
      const auth = getAuth()
      const user = auth.currentUser
      if (this.memberData.length <= 0) {
        this.memberData.push({
          userName: user.displayName,
          usermail: user.email,
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
          circleData: this.activeData,
          text: this.text,
          memberData: this.memberData,
        }
      )
      this.number = ""
      this.circleName = ""
      this.activeData.splice(0)
      this.memberData.splice(0)
      this.text = ""
      this.registerComplete = true
    },
  },
  computed: {
    registerJudge() {
      if (
        this.universityName === "" ||
        this.number <= 0 ||
        this.circleName === "" ||
        this.text === "" ||
        this.activeData.length === 0
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
    this.circleData = circleEditData.data()
    this.activeData = this.circleData.circleData
    this.circleName = this.circleData.name
    this.number = this.circleData.number
    this.text = this.circleData.text
    this.memberData = this.circleData.memberData
  },
  unmounted() {
    this.$emit("circleEditing", false)
  },
}
</script>
