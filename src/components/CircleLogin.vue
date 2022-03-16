<template>
  <div>
    <div>
      このサイトに登録されているサークルの中でどのサークルに所属しているのかを登録する
    </div>
    <div>学校名</div>
    <select
      name="university"
      id="university"
      v-on:click="selectCircle"
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
    <div>サークル名</div>
    <select name="circle" id="circle" v-model="circleKey">
      <option value="" selected>
        --自分が登録するサークル名を選んでください--
      </option>
      <option
        v-for="(registerCircle, index) in registerCircleList"
        v-bind:key="index"
        v-bind:value="registerCircle"
      >
        {{ registerCircle.name }}
      </option>
    </select>
    <div>
      <button v-on:click="userRegister">ユーザー登録</button>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase.js"
export default {
  props: {
    universityList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      universityKey: "", //現在どこの大学がselectされているのかを示す変数
      circleKey: "", //現在どこのサークルがselectされているのかを示す変数
      registerCircleList: [],
    }
  },
  methods: {
    selectCircle: async function () {
      this.registerCircleList.splice(0)
      if (this.universityKey != "") {
        const registerUniversity = await getDocs(
          collection(db, "univ", this.universityKey, "circle")
        )
        await registerUniversity.forEach((doc) => {
          this.registerCircleList.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      }
    },
    userRegister() {
      const auth = getAuth()
      const user = auth.currentUser
      if (user !== null) {
        this.circleKey.memberData.push({
          userName: user.displayName,
          usermail: user.email,
        })
        console.log(user)
        console.log(this.circleKey.memberData[0].userName)
        updateDoc(
          doc(
            collection(db, "univ", this.universityKey, "circle"),
            this.circleKey.name
          ),
          {
            memberData: this.circleKey.memberData,
          }
        )
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
select:invalid + .error-message {
  display: block;
}
</style>
