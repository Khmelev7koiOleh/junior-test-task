<script setup lang="ts">
const props = defineProps<{
  item: {
    country: {
      name: string
    }
    nextHoliday: {
      name: string
      date: string
    } | null
  }
}>()
</script>

<template>
  <div class="py-4 px-3 border border-black rounded">
    <h2 class="text-xl">{{ props.item.country.name }}</h2>
    <p v-if="item.nextHoliday">
      <span class="font-bold">Next Holiday:</span> {{ item.nextHoliday.name }}
    </p>
    <p v-else>No upcoming holidays</p>
    <p>{{ item.nextHoliday?.date }}</p>
  </div>
</template>
