<template>
  <CircleEdit
    v-bind:circleLoginName="circleLoginName"
    v-bind:universityName="universityName"
    v-bind:circleLogin="circleLogin"
    v-bind:userName="userName"
    v-bind:email="email"
    v-on:circleEditing="circleEditing"
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
    circleLogin: {
      type: Boolean,
      require: true,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  methods: {
    circleEditing(circleEditCheck) {
      this.$emit("circleEditing", circleEditCheck)
    },
  },
}
</script>
