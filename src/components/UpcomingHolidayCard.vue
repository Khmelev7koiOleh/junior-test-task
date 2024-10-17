<script setup lang="ts">
// Define props with type for item
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
    <!-- Display country name -->
    <h2 class="text-xl">{{ props.item.country.name }}</h2>

    <!-- Check if nextHoliday exists and display its details -->
    <p v-if="props.item.nextHoliday">
      <span class="font-bold">Next Holiday:</span>
      {{ props.item.nextHoliday.name }}
    </p>
    <p v-else>No upcoming holidays</p>

    <!-- Display holiday date if nextHoliday exists -->
    <p v-if="props.item.nextHoliday">{{ props.item.nextHoliday.date }}</p>
  </div>
</template>
