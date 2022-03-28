<template>
  <CircleEdit
    v-bind:circleLoginName="circleLoginName"
    v-bind:universityName="universityName"
    v-bind:userName="userName"
    v-bind:email="email"
    v-bind:userId="userId"
    v-on:circleEditing="circleEditing"
    v-on:myPageStates="myPageStates"
  ></CircleEdit>
</template>

<script>
import CircleEdit from "@/components/CircleEdit.vue"
export default {
  name: "CircleEditView",
  components: {
    CircleEdit,
  },
  props: {
    circleLoginName: {
      type: String,
      require: true,
    },
    universityName: {
      type: String,
      require: true,
    },
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
  methods: {
    circleEditing(circleEditCheck) {
      this.$emit("circleEditing", circleEditCheck)
    },
    myPageStates(open) {
      this.$emit("myPageStates", open)
    },
  },
}
</script>
