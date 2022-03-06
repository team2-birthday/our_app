<template>
  <div>
      <button v-on:click="resisterCircle">登録</button>
  </div>
</template>

<script>
    import { setDoc, doc} from "firebase/firestore";
    import { db } from "@/firebase.js";
    export default{
        data(){
            return{
                dates: ["3/10","3/11"],
                number: 0,
                places: ["公園","体育館"],
                text: "aa",
                name: "",
                universityList: [],
            }
        },
        methods:{
            resisterCircle(){
                setDoc(doc(db, "university", "0"), {
                    number: this.number,
                    dates: this.dates,
                    places: this.places,
                    text: this.text
                });
            }
        },
    }
</script>

<style></style>
