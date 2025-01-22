<template>
  <div class="p-6 bg-slate-100 border-2 max-w-[900px] m-auto">
    <form
      @submit.prevent="onSubmit"
      class="flex flex-col gap-4 md:flex-row justify-between"
    >
      <div>
        <label for="date" class="block mb-1 font-medium">Select a date:</label>
        <input
          id="date"
          type="date"
          v-model="selectedDate"
          :min="today"
          :max="threeMonthsFromNow"
          required
          class="p-2 border rounded w-full hover:cursor-pointer"
        />
      </div>
      <div>
        <label for="time" class="block mb-1 font-medium">Select a time:</label>
        <select
          id="time"
          v-model="selectedTime"
          required
          class="p-2 border rounded w-full hover:cursor-pointer"
        >
          <option
            v-for="time in availableTimes"
            :key="time.value"
            :value="time.value"
            :disabled="time.disabled"
          >
            {{ time.label }}
          </option>
        </select>
      </div>
      <div>
        <label for="guests" class="block mb-1 font-medium"
          >Number of guests:</label
        >
        <select
          id="guests"
          v-model="guestsNumber"
          required
          class="p-2 border rounded w-full hover:cursor-pointer"
        >
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <button
        type="submit"
        class="p-4 bg-black text-white w-full max-w-[200px] rounded"
      >
        Search
      </button>
    </form>
    <div v-if="searchStore.error" class="mt-4 text-red-500">
      {{ searchStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useSearchStore } from "@/stores/useSearchStore";
import { useRouter } from "vue-router";

// Store and Router
const searchStore = useSearchStore();
const router = useRouter();

// Types for the data
const today: string = new Date().toISOString().split("T")[0]; // Today's date
const threeMonthsFromNow: Date = new Date();
threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

// Form Data
const selectedDate = ref<string>(today);
const selectedTime = ref<string>("20:00");
const guestsNumber = ref<number>(2);

// Define the interface for available times
interface AvailableTime {
  value: string;
  label: string;
  disabled: boolean;
}

// Generate Available Times
const availableTimes = computed<AvailableTime[]>(() => {
  const times: AvailableTime[] = [];
  const now = new Date();
  const selectedDateValue = new Date(selectedDate.value);

  // Iterate over each 30-minute interval from 8:00 to 23:00
  for (let hour = 8; hour <= 23; hour++) {
    for (let minute of [0, 30]) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const time = new Date();
      time.setHours(hour, minute, 0, 0);

      // Disable times in the past if today is selected
      const isDisabled =
        selectedDateValue.toDateString() === now.toDateString() && time < now;

      times.push({
        value: timeValue,
        label: timeValue,
        disabled: isDisabled,
      });
    }
  }

  return times;
});

const onSubmit = async (): Promise<void> => {
  router.push("/search");
  await searchStore.runSearchWorkflow(
    selectedDate.value,
    selectedTime.value,
    guestsNumber.value
  );
};
</script>
