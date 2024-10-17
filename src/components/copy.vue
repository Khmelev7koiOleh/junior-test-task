<script setup lang="ts">
// Settups
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Components
import CountryCard from '../components/CountryCard.vue'
import UpcomingHolidayCard from '../components/UpcomingHolidayCard.vue'

// Types
interface Country {
  countryCode: string
  name: string
}

interface Holiday {
  date: string // Assuming you want to include the date of the holiday
  countryCode: string
  name: string
}

// Refs
const countries = ref<Country[]>([])
const search = ref('')
const randomCountries = ref<
  { country: Country; nextHoliday: Holiday | null }[]
>([])
const isLoading = ref(true)

// Computed
const filteredCountries = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()
  if (!searchTerm) return countries.value

  return countries.value.filter(country => {
    return country.name.toLowerCase().startsWith(searchTerm)
  })
})

// Hooks
onMounted(async () => {
  try {
    // Fetch the available countries
    const countriesResponse = await axios.get<Country[]>(
      'https://date.nager.at/api/v3/AvailableCountries',
    )
    countries.value = countriesResponse.data

    // Get 3 random countries and their next holidays
    randomCountries.value = await getRandomCountries(countries.value, 3)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
})

// Function to get 3 random countries and their next holidays
const getRandomCountries = async (countriesList: Country[], count: number) => {
  const selectedCountries = []

  while (selectedCountries.length < count) {
    const randomIndex = Math.floor(Math.random() * countriesList.length)
    const country = countriesList[randomIndex]

    // Fetch the next holiday for the selected country
    const nextHoliday = await fetchNextHoliday(country.countryCode)
    selectedCountries.push({ country, nextHoliday })
  }

  return selectedCountries
}

// Function to fetch the next holiday for a given country code
const fetchNextHoliday = async (countryCode: string) => {
  try {
    const { data } = await axios.get<Holiday[]>(
      `https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`,
    )
    return data[0] || null // Return the next holiday or null if none found
  } catch (error) {
    console.error(`Error fetching next holiday for ${countryCode}:`, error)
    return null // Return null on error
  }
}
</script>

<template>
  <div class="container w-full h-full py-20">
    <div class="flex flex-col md:flex-row md:gap-20">
      <!-- Search and Countries List Section -->
      <section class="h-[100vh] flex flex-col">
        <input
          @input="search = ($event.target as HTMLInputElement).value"
          type="text"
          placeholder="Search for a country"
          class="md:w-[20vw] p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Search Countries"
        />
        <!-- Countries List -->
        <h1 class="mt-5 text-2xl font-semibold mb-5">Countries List</h1>
        <div class="overflow-auto h-[60vh]">
          <div v-if="isLoading" class="text-center">Loading...</div>
          <!-- Loading State -->
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
          <div
            v-if="randomCountries.length > 0"
            class="flex flex-col justify-between gap-5 p-10"
          >
            <div v-for="(item, index) in randomCountries" :key="index">
              <!-- Upcoming Holiday Card -->
              <UpcomingHolidayCard :item="item" />
            </div>
          </div>
          <div v-else class="text-center">No random countries available.</div>
          <!-- Fallback if no random countries -->
        </div>
      </section>
    </div>
  </div>
</template>
