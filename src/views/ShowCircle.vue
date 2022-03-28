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
      <div class="favorite-btn">
        <button
          v-on:click="favoriteButtonClick(index)"
          v-bind:class="{
            'favorite-btn-on': favoriteFont[index],
            'favorite-btn-off': !favoriteFont[index],
          }"
        >
          ★
        </button>
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
      favoriteFont: [], //お気に入りボタンを状態をサークルの数だけ生成し、独立させる
      userData: null, //登録したユーザー情報を格納する変数
      universityName: "", //現在どこの大学なのかを格納する変数
    }
  },
  methods: {
    async favoriteButtonClick(index) {
      if (this.userName !== "" && this.email !== "" && this.userId !== "") {
        const user = await getDoc(doc(db, "userData", this.userId))
        this.userData = user.data()
        if (this.favoriteFont[index] === false) {
          this.favoriteFont[index] = !this.favoriteFont[index]
          this.userData.newComerCircle.push({
            circleName: this.circle_data[index].name,
            schedule: this.circle_data[index].schedule,
            universityName: this.universityName,
          })
          await updateDoc(doc(db, "userData", this.userId), {
            newComerCircle: this.userData.newComerCircle,
          })
        } else {
          this.favoriteFont[index] = !this.favoriteFont[index]
          for (let i = 0; i < this.userData.newComerCircle.length; i++) {
            if (
              this.userData.newComerCircle[i].universityName ===
                this.universityName &&
              this.userData.newComerCircle[i].circleName ===
                this.circle_data[index].name
            ) {
              this.userData.newComerCircle.splice(i, 1)
              await updateDoc(doc(db, "userData", this.userId), {
                newComerCircle: this.userData.newComerCircle,
              })
            }
          }
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
      this.favoriteFont.splice(0)
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
                this.favoriteFont.push(true)
                break
              } else if (j === this.userData.newComerCircle.length - 1) {
                this.favoriteFont.push(false)
              }
            }
          }
        } else {
          for (let k = 0; k < this.circle_data.length; k++) {
            this.favoriteFont.push(false)
          }
        }
      } else {
        for (let k = 0; k < this.circle_data.length; k++) {
          this.favoriteFont.push(false)
        }
      }
    },
  },
  created: async function () {
    this.favoriteFont.splice(0)
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
              this.favoriteFont.push(true)
              break
            } else if (j === this.userData.newComerCircle.length - 1) {
              this.favoriteFont.push(false)
            }
          }
        }
      } else {
        for (let k = 0; k < this.circle_data.length; k++) {
          this.favoriteFont.push(false)
        }
      }
    } else {
      for (let k = 0; k < this.circle_data.length; k++) {
        this.favoriteFont.push(false)
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

.favorite-btn {
  text-align: right;
}

.favorite-btn-on {
  font-size: 25px;
  background: transparent;
  border: none;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(135deg, #fdeb71 10%, #f8d800 100%);
}

.favorite-btn-off {
  background: transparent;
  border: none;
  font-size: 25px;
  color: gray;
}
</style>
