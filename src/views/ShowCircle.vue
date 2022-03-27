<template>
  <div class="show-circle">
    <div class="block" v-for="(data, index) in circle_data" v-bind:key="index">
      <div class="name">{{ data.name }}</div>
      <div>人数：{{ data.number }}人</div>
      <div>{{ data.text }}</div>
      <div>開催日程：場所</div>
      <div v-for="(plan, index) in data.schedule" v-bind:key="index">
        {{ plan.date }}:{{ plan.place }}
      </div>
      <div
        v-on:click="favoriteButtonClick(index)"
        v-bind:class="favoriteIconData[index].favoriteFont"
      >
        ★
      </div>
    </div>
  </div>
</template>
<script>
import { doc, collection, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../firebase.js"
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
      circle_data: [],
      favoriteIconData: [], //お気に入りボタンを状態をサークルの数だけ生成し、独立させる
      userData: null, //登録したユーザー情報を格納する変数
      universityName: "", //現在どこの大学なのかを格納する変数
    }
  },
  methods: {
    async favoriteButtonClick(index) {
      if (this.userName !== "" && this.email !== "" && this.userId !== "") {
        const user = await getDoc(doc(db, "userData", this.userId))
        this.userData = user.data()
        if (this.favoriteIconData[index].favoriteState === false) {
          this.favoriteIconData[index].favoriteState =
            !this.favoriteIconData[index].favoriteState
        }
        if (
          this.favoriteIconData[index].favoriteState &&
          this.favoriteIconData[index].favoriteFont === "favorite-btn-off"
        ) {
          this.favoriteIconData[index].favoriteFont = "favorite-btn-on"
          this.userData.newComerCircle.push({
            circleName: this.circle_data[index].name,
            schedule: this.circle_data[index].schedule,
            universityName: this.universityName,
          })
          await updateDoc(doc(db, "userData", this.userId), {
            newComerCircle: this.userData.newComerCircle,
          })
        }
      } else {
        alert("ユーザーログインしてください")
      }
    },
  },
  watch: {
    // このページでログインされた場合既にnewComerCiercleに登録されているサークルのお気に入りボタンをonにする
    // 逆にページでログアウトされた場合サークルのお気に入りボタンをすべてoffにする
    async userId() {
      //一旦アイコンの状態を初期化
      this.favoriteIconData.splice(0)
      if (this.userName !== "" && this.email !== "" && this.userId !== "") {
        const user = await getDoc(doc(db, "userData", this.userId))
        this.userData = user.data()
        // 既にお気に入りに登録していたらお気に入りボタンをonにしておく
        if (this.userData.newComerCircle.length > 0) {
          for (let i = 0; i < this.circle_data.length; i++) {
            for (let j = 0; j < this.userData.newComerCircle.length; j++) {
              if (
                this.circle_data[i].name ===
                  this.userData.newComerCircle[j].circleName &&
                this.universityName ===
                  this.userData.newComerCircle[j].universityName
              ) {
                this.favoriteIconData.push({
                  favoriteState: true,
                  favoriteFont: "favorite-btn-on",
                })
                break
              } else if (j === this.userData.newComerCircle.length - 1) {
                this.favoriteIconData.push({
                  favoriteState: false,
                  favoriteFont: "favorite-btn-off",
                })
              }
            }
          }
        } else {
          for (let k = 0; k < this.circle_data.length; k++) {
            this.favoriteIconData.push({
              favoriteState: false,
              favoriteFont: "favorite-btn-off",
            })
          }
        }
      } else {
        for (let k = 0; k < this.circle_data.length; k++) {
          this.favoriteIconData.push({
            favoriteState: false,
            favoriteFont: "favorite-btn-off",
          })
        }
      }
    },
  },
  created: async function () {
    this.favoriteIconData.splice(0)
    const id = "愛国学園大学"
    this.universityName = id
    const snapshot = await getDocs(collection(db, "univ", id, "circle"))
    await snapshot.forEach((doc) => {
      this.circle_data.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    if (this.userName !== "" && this.email !== "" && this.userId !== "") {
      const user = await getDoc(doc(db, "userData", this.userId))
      this.userData = user.data()
      // 既にお気に入りに登録していたらお気に入りボタンをonにしておく
      if (this.userData.newComerCircle.length > 0) {
        for (let i = 0; i < this.circle_data.length; i++) {
          for (let j = 0; j < this.userData.newComerCircle.length; j++) {
            if (
              this.circle_data[i].name ===
                this.userData.newComerCircle[j].circleName &&
              this.universityName ===
                this.userData.newComerCircle[j].universityName
            ) {
              this.favoriteIconData.push({
                favoriteState: true,
                favoriteFont: "favorite-btn-on",
              })
              break
            } else if (j === this.userData.newComerCircle.length - 1) {
              this.favoriteIconData.push({
                favoriteState: false,
                favoriteFont: "favorite-btn-off",
              })
            }
          }
        }
      } else {
        for (let k = 0; k < this.circle_data.length; k++) {
          this.favoriteIconData.push({
            favoriteState: false,
            favoriteFont: "favorite-btn-off",
          })
        }
      }
    } else {
      for (let k = 0; k < this.circle_data.length; k++) {
        this.favoriteIconData.push({
          favoriteState: false,
          favoriteFont: "favorite-btn-off",
        })
      }
    }
  },
}
</script>
<style>
.show-circle {
  font-family: "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "游明朝",
    "Yu Mincho", "游明朝体", "YuMincho", "ＭＳ Ｐ明朝", "MS PMincho", serif;
  padding-top: 15%;
}

.block {
  /* display: flex; */
  border: solid 2px black;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 3%;
}

.favorite-btn-on {
  text-align: right;
  font-size: 20px;
  color: rgb(0, 195, 255);
}

.favorite-btn-off {
  text-align: right;
  font-size: 20px;
  color: gray;
}
</style>
