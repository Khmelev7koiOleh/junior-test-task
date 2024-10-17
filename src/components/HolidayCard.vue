<script setup lang="ts">
const props = defineProps<{
  holiday: {
    date: string
    localName: string
  }
}>()
</script>

<template>
  <div class="w-[80vw] md:w-[35vw] text-xl h-30 border p-5 border-black">
    <li>{{ props.holiday.localName }}</li>
    <li>{{ props.holiday.date }}</li>
  </div>
</template>
