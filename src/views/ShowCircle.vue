<template>
  <div class="block" v-for="data in circle_data" v-bind:key="data">
    <div class="name">{{ data.name }}</div>
    <div>人数：{{ data.number }}人</div>
    <div>{{ data.text }}</div>
    <div>開催日程：場所</div>
    <div v-for="(day, index) in data.date" v-bind:key="day">
      {{ day }}:{{ data.place[index] }}
    </div>
  </div>
</template>
<script>
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase.js"
export default {
  data() {
    return {
      circle_data: [],
    }
  },
  methods: {},
  created: async function () {
    const id = "福岡大学"
    const snapshot = await getDocs(collection(db, "univ", id, "circle"))
    await snapshot.forEach((doc) => {
      this.circle_data.push({
        id: doc.id,
        ...doc.data(),
      })
    })
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
