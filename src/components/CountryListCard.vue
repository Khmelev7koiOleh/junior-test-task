<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  country: Country
  index: number
}>()
</script>

<template>
  <div class="w-[35vw] h-30 border py-5 border-black">
    <p class="text-center">{{ props.country.name }} - {{ props.index + 1 }}</p>
  </div>
</template>
