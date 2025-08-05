<template>
  <div>
    <label class="block font-semibold mb-1">Response:</label>
    <div class="text-sm text-gray-700 mb-2">
      Status: {{ status || 'N/A' }} | Time: {{ timeTaken }} ms
    </div>
    <pre
      class="bg-gray-100 border p-4 rounded max-h-96 overflow-auto font-mono text-sm whitespace-pre-wrap"
    >{{ formattedResponse }}</pre>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  response: [Object, String, null],
  status: String,
  timeTaken: Number,
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
