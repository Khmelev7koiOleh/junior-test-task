<template>
  <div class="">
    <div class="border border-black py-6 text-center">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  title: String,
})
const { title } = toRefs(props)
</script>

<style lang="scss" scoped></style>
