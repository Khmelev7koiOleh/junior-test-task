<script setup lang="ts">
import { type Holiday } from '../types/types'
const props = defineProps<{
  holiday: Holiday
}>()
</script>

<template>
  <div class="w-[35vw] text-xl h-30 border p-5 border-black">
    <li>{{ props.holiday.localName }}</li>
    <li>{{ props.holiday.date }}</li>
  </div>
</template>
