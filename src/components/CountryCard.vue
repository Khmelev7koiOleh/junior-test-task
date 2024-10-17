<script setup lang="ts">
import { RouterLink } from 'vue-router'

// Props definition
const props = defineProps<{
  country: {
    name: string
    countryCode: string
  }
  index: number
}>()
</script>

<template>
  <RouterLink
    :to="`/countries/${encodeURIComponent(country.name)}-${country.countryCode}`"
  >
    <div
      class="w-[35vw] h-30 border py-5 border-black hover:bg-gray-100 transition"
    >
      <p class="text-center">{{ country.name }} - {{ index + 1 }}</p>
    </div>
  </RouterLink>
</template>
