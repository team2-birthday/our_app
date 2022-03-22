<template>
  <div>
    <div v-for="(user, index) in users" v-bind:key="index">
      <div>{{ user.userName }}</div>
      <div>{{ user.userMail }}</div>
    </div>
    <div>
      <div>登録したサークル一覧</div>
      <div v-if="id === -1">まだ何も登録をしていません</div>
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
  },
  data() {
    return {
      id: 0, //ログインしたユーザーがどこの要素に入っているのかを確認する変数
      users: [], //登録したユーザー情報を格納する配列
      registerCircleData: [], //登録したサークルの情報を格納する変数
    }
  },
  async beforeMount() {
    const userData = await getDoc(doc(db, "userData", "users"))
    this.users = userData.data().userData
    for (let i = 0; i < this.users.length; i++) {
      if (
        this.userName === this.users[i].userName &&
        this.email === this.users[i].userMail
      ) {
        this.id = i
        for (let j = 0; j < this.users[this.id].registerCircle.length; j++) {
          const circleData = await getDoc(
            doc(
              collection(
                db,
                "univ",
                this.users[this.id].registerCircle[j].universityName,
                "circle"
              ),
              this.users[this.id].registerCircle[j].circleName
            )
          )
          this.registerCircleData.push(circleData.data())
        }
        break
      } else if (i === this.users.length - 1) {
        //何もサークルを登録していない場合はidを-1にする
        this.id = -1
      }
    }
  },
  mounted() {
    this.$emit("myPageStates", true)
  },
  unmounted() {
    this.users.splice(0)
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
