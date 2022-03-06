<template>
  <div>
    {{ circle_data }}
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
    const snapshot = await getDocs(collection(db, "univ"))
    await snapshot.forEach((doc) => {
      this.circle_data.push({
        id: doc.id,
        ...doc.data(),
      })
    })
  },
}
</script>
<style></style>
