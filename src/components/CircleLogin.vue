<template>
  <div>
    <div>
      このサイトに登録されているサークルの中でどのサークルに所属しているのかを登録する
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase.js"
export default {
  data() {
    return {
      universityName: "",
      existUniversityList: [],
      registerCircleList: [],
    }
  },
  methods: {
    selectCircle: async function () {
      const registerUniversity = await getDocs(
        collection(db, "univ", this.universityName, "circle")
      )
      await registerUniversity.forEach((doc) => {
        this.registerCircleList.push({
          id: doc.id,
          ...doc.data(),
        })
      })
    },
  },
  created() {},
}
</script>
