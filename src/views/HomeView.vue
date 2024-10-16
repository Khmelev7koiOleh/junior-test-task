<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CountryListCard from '@/components/CountryListCard.vue'
import axios from 'axios'

interface Country {
  countryCode: string
  name: string
}

const countries = ref<Country[]>([])

const search = ref('')

const filteredCountries = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()
  if (!searchTerm) return countries.value

  return countries.value.filter(country => {
    return country.name.toLowerCase().startsWith(searchTerm)
  })
})

const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await axios.get<Country[]>(
      'https://date.nager.at/api/v3/AvailableCountries',
    )
    countries.value = data
  } catch (error) {
    console.error('Error fetching countries:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main id="main">
    <div class="w-full h-full py-20 container">
      <div class="flex items-start">
        <div class="w-full h-[100vh] flex flex-col">
          <!-- Search Bar -->
          <input
            @input="search = ($event.target as HTMLInputElement).value"
            type="text"
            placeholder="Search Input"
            class="w-[15vw] p-2 border border-black"
          />
          <h1 class="mt-5 text-2xl mb-5">Countries List</h1>
          <!-- Card List -->
          <div class="overflow-auto h-[60vh]">
            <div v-if="isLoading">Loading...</div>
            <!-- Loading State -->
            <div v-else>
              <div
                v-for="(country, index) in filteredCountries"
                :key="index"
                class="flex w-full flex-col py-3"
              >
                <!-- Card -->
                <CountryListCard :country="country" :index="index" />
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full">
          <h1 class="text-2xl">Random Countries Widget</h1>
          <div class="w-full h-full border border-[2-px] border-black"></div>
        </div>
      </div>
    </div>
  </main>
</template>
