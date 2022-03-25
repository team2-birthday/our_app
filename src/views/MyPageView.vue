<template>
  <div>
    <div>{{ userData.userName }}</div>
    <div>{{ userData.userMail }}</div>
    <div>
      <div>登録したサークル一覧</div>
      <div v-if="userData.registerCircle.length === 0">
        まだ何も登録をしていません
      </div>
      <div v-else>
        <div
          class="block"
          v-for="(data, index) in registerCircleData"
          v-bind:key="index"
        >
          <div class="name">{{ data.name }}</div>
          <div>人数：{{ data.number }}人</div>
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
      registerCircleData: [], //登録したサークルの情報を格納する変数
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
    }
  },
  mounted() {
    this.$emit("myPageStates", true)
  },
  unmounted() {
    this.userData = null
    this.registerCircleData.splice(0)
    this.$emit("myPageStates", false)
  },
}
</script>

<style>
.block {
  /* display: flex; */
  border: solid 2px black;
  border-radius: 5px;
  text-align: center;
}
</style>
