<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  year: number
  selectedYear: number
}>()

const emit = defineEmits(['switchYear'])

const switchYear = () => {
  emit('switchYear', props.year)
}
</script>

<template>
  <button
    @click="switchYear"
    :class="{ 'text-white bg-blue-500': props.year === props.selectedYear }"
    class="p-2 border rounded border-black"
  >
    {{ props.year }}
  </button>
</template>
