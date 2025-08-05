<template>
  <div>
    <label class="block font-semibold mb-1">Response:</label>
    <div v-if="loading" class="text-center p-4">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div class="text-sm text-gray-700 mb-2">
        Status: {{ status || 'N/A' }} | Time: {{ timeTaken }} ms
      </div>
      <pre
        v-if="!error"
        class="bg-gray-100 border p-4 rounded max-h-96 overflow-auto font-mono text-sm whitespace-pre-wrap"
      >{{ formattedResponse }}</pre>
      <pre
        v-else
        class="bg-red-100 border border-red-400 text-red-700 p-4 rounded max-h-96 overflow-auto font-mono text-sm whitespace-pre-wrap"
      >{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  response: [Object, String, null],
  status: String,
  timeTaken: Number,
  loading: Boolean,
  error: [String, null],
});

const { response } = toRefs(props);

const formattedResponse = computed(() => {
  if (!response.value) return '';
  if (typeof response.value === 'object') {
    try {
      return JSON.stringify(response.value, null, 2);
    } catch {
      return String(response.value);
    }
  }
  return String(response.value);
});
</script>