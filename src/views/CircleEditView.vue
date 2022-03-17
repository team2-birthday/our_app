<template>
  <CircleEdit
    v-bind:circleLoginName="circleLoginName"
    v-bind:universityName="universityName"
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
  },
  methods: {
    circleEditing(circleEditCheck) {
      this.$emit("circleEditing", circleEditCheck)
    },
  },
}
</script>
