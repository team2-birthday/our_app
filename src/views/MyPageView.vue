<template>
  <div>
    <div class="user-data">
      <div>{{ userData.userName }}</div>
      <div>{{ userData.userMail }}</div>
    </div>
    <div>
      <div class="item">所属しているサークル一覧</div>
      <div v-if="registerCircleData.length === 0">
        まだ何も登録をしていません
      </div>
      <div v-else>
        <div
          class="circle-block"
          v-for="(data, index) in registerCircleData"
          v-bind:key="index"
        >
          <div class="name">サークル名:{{ data.name }}</div>
          <div>人数：{{ data.number }}人</div>
          <div>詳細</div>
          <div>{{ data.text }}</div>
          <div>開催日程：場所</div>
          <div v-for="(plan, index) in data.schedule" v-bind:key="index">
            {{ plan.date }}:{{ plan.place }}
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="item">お気に入りサークル一覧</div>
      <div v-if="newComerCircleData.length === 0">
        まだ何も登録をしていません
      </div>
      <div v-else>
        <div
          class="circle-block"
          v-for="(data, index) in newComerCircleData"
          v-bind:key="index"
        >
          <div class="name">サークル名:{{ data.name }}</div>
          <div>人数：{{ data.number }}人</div>
          <div>詳細</div>
          <div>{{ data.text }}</div>
          <div>開催日程：場所</div>
          <div v-for="(plan, index) in data.schedule" v-bind:key="index">
            {{ plan.date }}:{{ plan.place }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, collection } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  props: {
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
      userData: "", //登録したユーザー情報を格納する変数
      registerCircleData: [], //登録した所属しているサークルの情報を格納する変数
      newComerCircleData: [], //お気に入りサークルの情報を格納する変数
    }
  },
  async created() {
    const user = await getDoc(doc(db, "userData", this.userId))
    this.userData = user.data()
    if (
      this.userName === this.userData.userName &&
      this.email === this.userData.userMail
    ) {
      for (let i = 0; i < this.userData.registerCircle.length; i++) {
        const circleData = await getDoc(
          doc(
            collection(
              db,
              "univ",
              this.userData.registerCircle[i].universityName,
              "circle"
            ),
            this.userData.registerCircle[i].circleName
          )
        )
        this.registerCircleData.push(circleData.data())
      }
      for (let j = 0; j < this.userData.newComerCircle.length; j++) {
        const newComerCircle = await getDoc(
          doc(
            collection(
              db,
              "univ",
              this.userData.newComerCircle[j].universityName,
              "circle"
            ),
            this.userData.newComerCircle[j].circleName
          )
        )
        this.newComerCircleData.push(newComerCircle.data())
      }
    }
  },
  mounted() {
    this.$emit("myPageStates", true)
  },
  unmounted() {
    this.userData = null
    this.registerCircleData.splice(0)
    this.newComerCircleData.splice(0)
    this.$emit("myPageStates", false)
  },
}
</script>

<style>
.user-data {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  text-align: left;
  margin-left: 2%;
  margin-bottom: 2%;
  font-size: 30px;
}

.item {
  font-size: 20px;
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

.circle-block {
  /* display: flex; */
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  border: solid 2px black;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 3%;
}
</style>
