<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import HolidayListCard from '@/components/HolidayListCard.vue'
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

// Route parameters
const route = useRoute()
const countryName = route.params.name as string
const countryCode = route.params.countryCode as string

// Function to fetch holidays based on the selected year and country code
const fetchHolidays = async (year: number) => {
  try {
    if (!countryCode) {
      throw new Error('Country code is undefined')
    }
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
    console.log(`Fetching holidays for ${year} from URL: ${url}`)
    const { data } = await axios.get<Holiday[]>(url)
    holidays.value = data
  } catch (error) {
    console.error('Error fetching holidays:', error)
  }
}

// Fetch holidays for the default selected year on mount
onMounted(() => {
  fetchHolidays(selectedYear.value)
})

// Method to handle year switch when a button is clicked
const switchYear = (year: number) => {
  selectedYear.value = year
  fetchHolidays(year) // Fetch holidays for the selected year
}
</script>

<template>
  <main>
    <div class="container w-full h-full py-20 flex flex-col gap-10">
      <!-- Heading -->
      <div class="flex items-center gap-5">
        <h1 class="text-2xl">{{ countryName }}</h1>
        <div class="w-1 h-1 bg-black"></div>
        <h2 class="text-2xl">Country Code: {{ countryCode }}</h2>
      </div>

      <!-- Holidays List -->
      <h2 class="text-2xl">Holidays for {{ selectedYear }}</h2>
      <div class="flex flex-col h-[60vh] overflow-auto gap-5">
        <ul v-for="(holiday, index) in holidays" :key="index">
          <HolidayListCard :holiday="holiday" />
        </ul>
      </div>

      <!-- Year Buttons (Pagination for 2020-2030) -->
      <div class="flex gap-5 items-center">
        <div v-for="year in years.year" :key="year">
          <Btn
            :year="year"
            :selectedYear="selectedYear"
            @switchYear="switchYear"
          />
        </div>
      </div>
    </div>
  </main>
</template>
