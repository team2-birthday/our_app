<template>
  <div v-if="registerComplete">
    <div>登録が完了しました</div>
    <div>下のリンクから戻って下さい</div>
    <router-link to="/">home</router-link>
  </div>
  <div v-else>
    <div>
      <div>登録前にログインしてください</div>
      <div>学校名</div>
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
      活動日程
      <div>
        <input type="date" v-model="schedule" required />
        <button v-on:click="datesPush">日程登録</button>
      </div>
      現在登録した日程（削除可能）
      <div v-for="(date, index) in dates" v-bind:key="index">
        {{ date }}
        <button v-on:click="dateDelete(index)" class="delete-btn">削除</button>
      </div>
    </div>
    <div>
      活動場所
      <div>
        <input type="text" v-model="location" placeholder="活動場所" required />
        <button v-on:click="placesPush">活動場所登録</button>
      </div>
      現在登録した活動場所（削除可能）
      <div v-for="(place, index) in places" v-bind:key="index">
        {{ place }}
        <button v-on:click="placeDelete(index)" class="delete-btn">削除</button>
      </div>
    </div>
    <button v-on:click="registerCircle" v-bind:disabled="registerJudge">
      登録
    </button>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth"
import { collection, setDoc, doc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  props: {
    universityList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dates: [],
      number: "",
      places: [],
      text: "",
      circleName: "",
      universityKey: "", //現在どこの大学がselectされているのかを示す変数
      location: "", //活動場所をpushする変数
      schedule: "", //活動日程をpushする変数
      registerComplete: false, //サークルの登録したかどうかを確かめる変数
      memberData: [], //会員のデータを格納する変数
    }
  },
  methods: {
    datesPush() {
      if (this.schedule != "") {
        this.dates.push(this.schedule)
        //昇順に並べる
        this.dates = [...this.dates].sort((a, b) => new Date(a) - new Date(b))
      }
      this.schedule = ""
    },
    dateDelete(date) {
      this.dates.splice(date, 1)
    },
    placesPush() {
      if (this.location != "") {
        this.places.push(this.location)
      }
      this.location = ""
    },
    placeDelete(place) {
      this.places.splice(place, 1)
    },
    registerCircle() {
      const auth = getAuth()
      const user = auth.currentUser
      if (user === null) {
        alert("ログインしてから登録して下さい。")
      } else {
        this.memberData.push({
          userName: user.displayName,
          usermail: user.email,
        })
        setDoc(
          doc(
            collection(db, "univ", this.universityKey, "circle"),
            this.circleName
          ),
          {
            number: this.number,
            name: this.circleName,
            dates: this.dates,
            places: this.places,
            text: this.text,
            memberData: this.memberData,
          }
        )
        this.number = ""
        this.circleName = ""
        this.dates.splice(0)
        this.places.splice(0)
        this.text = ""
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
        this.dates.length === 0 ||
        this.places.length === 0
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style>
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

.delete-btn {
  border: solid 1px black;
  background-color: white;
}
.delete-btn:hover {
  background-color: red;
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
