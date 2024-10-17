<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import CountryCard from '../components/CountryCard.vue'
import UpcomingHolidayCard from '../components/UpcomingHolidayCard.vue'

// Types
interface Country {
  countryCode: string
  name: string
}

interface Holiday {
  date: string
  countryCode: string
  name: string
}

// Reactive references
const countries = ref<Country[]>([])
const search = ref('')
const randomCountries = ref<
  { country: Country; nextHoliday: Holiday | null }[]
>([])
const isLoading = ref(true)
const isRandomLoading = ref(false)

// Computed property for filtered countries based on search input
const filteredCountries = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()
  if (!searchTerm) return countries.value
  return countries.value.filter(country =>
    country.name.toLowerCase().startsWith(searchTerm),
  )
})

// Fetch data on component mount
onMounted(async () => {
  await fetchCountries()
  await fetchRandomCountries(3)
})

// Fetch the list of countries
const fetchCountries = async () => {
  try {
    isLoading.value = true
    const { data } = await axios.get<Country[]>(
      'https://date.nager.at/api/v3/AvailableCountries',
    )
    countries.value = data
  } catch (error) {
    console.error('Error fetching countries:', error)
  } finally {
    isLoading.value = false
  }
}

// Fetch random countries with their next holidays
const fetchRandomCountries = async (count: number) => {
  try {
    isRandomLoading.value = true
    const selectedCountries = []
    const countryCount = countries.value.length

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * countryCount)
      const country = countries.value[randomIndex]

      const nextHoliday = await fetchNextHoliday(country.countryCode)
      selectedCountries.push({ country, nextHoliday })
    }

    randomCountries.value = selectedCountries
  } catch (error) {
    console.error('Error fetching random countries:', error)
  } finally {
    isRandomLoading.value = false
  }
}

// Fetch the next holiday for a specific country code
const fetchNextHoliday = async (
  countryCode: string,
): Promise<Holiday | null> => {
  try {
    const { data } = await axios.get<Holiday[]>(
      `https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`,
    )
    return data[0] || null // Return first holiday or null if none found
  } catch (error) {
    console.error(`Error fetching next holiday for ${countryCode}:`, error)
    return null
  }
}
</script>

<template>
  <div class="container w-full h-full py-20">
    <div class="flex flex-col md:flex-row md:gap-20">
      <!-- Search and Countries List Section -->
      <section class="h-[100vh] flex flex-col">
        <input
          v-model="search"
          type="text"
          placeholder="Search for a country"
          class="md:w-[20vw] p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Search Countries"
        />
        <!-- Countries List -->
        <h1 class="mt-5 text-2xl font-semibold mb-5">Countries List</h1>
        <div class="overflow-auto h-[60vh]">
          <div v-if="isLoading" class="text-center">Loading...</div>
          <div v-else>
            <div
              v-for="(country, index) in filteredCountries"
              :key="index"
              class="flex w-full flex-col py-3"
            >
              <!-- Country Card -->
              <CountryCard :country="country" :index="index" />
            </div>
          </div>
        </div>
      </section>

      <!-- Random Countries Widget Section -->
      <section class="flex-1 h-full mt-10 md:mt-0">
        <h1 class="text-2xl font-semibold mb-10">Random Countries Widget</h1>
        <div
          class="w-full h-[60vh] overflow-auto border-2 border-black rounded-md"
        >
          <div v-if="isRandomLoading" class="text-center">
            Loading Random Countries...
          </div>
          <div
            v-else-if="randomCountries.length > 0"
            class="flex flex-col justify-between gap-5 p-10"
          >
            <div v-for="(item, index) in randomCountries" :key="index">
              <!-- Upcoming Holiday Card -->
              <UpcomingHolidayCard :item="item" />
            </div>
          </div>
          <div v-else class="text-center">No random countries available.</div>
        </div>
      </section>
    </div>
  </div>
</template>
