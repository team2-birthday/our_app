<template>
  <div>
    <div>
      サークル名
      <input type="text" v-model="circleName" />
    </div>
    <div>
      総数
      <input type="number" v-model="number" />
    </div>
    <div>
      説明文
      <input type="text" v-model="text" />
    </div>
    <div>
      活動場所
      <div>
        <input type="text" v-model="location" />
        <button v-on:click="placesPush">活動場所登録</button>
      </div>
      現在登録した活動場所（削除可能）
      <div v-for="(place, index) in places" v-bind:key="index">
        {{ place }}
        <button v-on:click="placeDelete(index)" class="place-delete-btn">
          削除
        </button>
      </div>
    </div>
    <button v-on:click="resisterCircle">登録</button>
  </div>
</template>

<script>
import { collection, setDoc, doc } from "firebase/firestore"
import { db } from "@/firebase.js"
export default {
  data() {
    return {
      dates: [],
      number: "",
      places: [],
      text: "",
      circleName: "",
      universityList: [],
      location: "", //活動場所をpushする変数
    }
  },
  methods: {
    placesPush() {
      if (this.location != "") {
        this.places.push(this.location)
      }
      this.location = ""
      console.log(this.places)
    },
    placeDelete(place) {
      const i = this.places.indexOf(place)
      this.places.splice(i, 1)
    },
    resisterCircle() {
      setDoc(
        doc(collection(db, "univ", "福岡大学", "circle"), this.circleName),
        {
          number: this.number,
          name: this.circleName,
          places: this.places,
          text: this.text,
        }
      )
    },
  },
}
</script>

<style>
.place-delete-btn {
  border: solid 1px black;
  background-color: white;
}
.place-delete-btn:hover {
  background-color: #03d1f5;
}
</style>
