<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import HolidayCard from '@/components/HolidayCard.vue'
import Btn from '@/components/Btn.vue'

// Define a type for a holiday
interface Holiday {
  date: string
  localName: string
  name: string
  countryCode: string
}

// Get the current year
const currentYear = new Date().getFullYear()

// Reactive state for years and selected year
const years = reactive({
  year: Array.from({ length: 11 }, (_, i) => 2020 + i), // Years 2020 to 2030
})

const selectedYear = ref(currentYear) // Default to the current year
const holidays = ref<Holiday[]>([])
const loading = ref(false)
const errorMessage = ref('')

// Route parameters
const route = useRoute()

// Safely extract route parameters
const countryName = route.params.CountryView || 'Unknown Country'
const countryCode = route.params.countryCode || 'Unknown Code'

// Log values for debugging
console.log('Country Name:', countryName)
console.log('Country Code:', countryCode)

// Function to fetch holidays based on the selected year and country code
const fetchHolidays = async (year: number) => {
  try {
    if (!countryCode) {
      throw new Error('Country code is undefined')
    }
    loading.value = true
    errorMessage.value = '' // Reset error message
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
    console.log(`Fetching from URL: ${url}`)

    const { data } = await axios.get<Holiday[]>(url)

    // Log the fetched holidays for debugging
    console.log('Fetched Holidays:', data)

    holidays.value = data
  } catch (error) {
    errorMessage.value = 'Failed to fetch holidays. Please try again later.'
    console.error('Error fetching holidays:', error)
  } finally {
    loading.value = false
  }
}

// Fetch holidays for the default selected year on mount
onMounted(() => {
  fetchHolidays(selectedYear.value)
})

// Method to handle year switch
const switchYear = (year: number) => {
  if (selectedYear.value !== year) {
    selectedYear.value = year
    fetchHolidays(year) // Fetch holidays for the selected year
  }
}
</script>

<template>
  <main>
    <div class="container w-full h-full py-20 flex flex-col gap-10">
      <!-- Heading -->
      <header class="flex items-center gap-5">
        <h1 class="text-2xl">{{ countryName }}</h1>
        <div class="w-1 h-1 bg-black rounded-full"></div>
        <h2 class="text-2xl">Country Code: {{ countryCode }}</h2>
      </header>

      <!-- Holidays List -->
      <section class="flex flex-col gap-5">
        <h2 class="text-2xl">Holidays for {{ selectedYear }}</h2>

        <!-- Show a loading indicator if fetching data -->
        <div v-if="loading" class="text-center">
          <p>Loading holidays...</p>
        </div>

        <!-- Conditionally Render Holidays List or an Error Message -->
        <div
          v-else-if="holidays.length"
          class="flex flex-col h-[60vh] overflow-auto gap-5"
        >
          <ul class="flex flex-col gap-5">
            <li v-for="(holiday, index) in holidays" :key="index">
              <HolidayCard :holiday="holiday" />
            </li>
          </ul>
        </div>

        <!-- Error message if fetching holidays fails -->
        <div v-else-if="errorMessage">
          <p class="text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- No holidays message -->
        <div v-else>
          <p>No holidays available for this year.</p>
        </div>
      </section>

      <!-- Year Buttons (Pagination for 2020-2030) -->
      <nav class="grid grid-cols-4 gap-5 md:flex md:gap-5 md:items-center">
        <div v-for="year in years.year" :key="year">
          <Btn
            :year="year"
            :selectedYear="selectedYear"
            @switchYear="switchYear"
          />
        </div>
      </nav>
    </div>
  </main>
</template>
