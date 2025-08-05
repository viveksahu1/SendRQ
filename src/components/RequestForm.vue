<template>
  <div>
    <div class="flex space-x-2 mb-4">
      <select v-model="method" class="border rounded p-2 w-24">
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <input
        v-model="url"
        type="text"
        placeholder="https://api.example.com/data"
        class="flex-1 border rounded p-2"
      />
      <button @click="sendRequest" class="bg-blue-600 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>

    <div v-if="method !== 'GET'" class="mb-4">
      <label class="block font-semibold mb-1">Request Body (JSON):</label>
      <textarea
        v-model="requestBody"
        rows="6"
        class="w-full border rounded p-2 font-mono"
        placeholder='{"key":"value"}'
      ></textarea>
    </div>

    <ResponseView
      :response="response"
      :status="status"
      :timeTaken="timeTaken"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ResponseView from './ResponseView.vue';

const method = ref('GET');
const url = ref('');
const requestBody = ref('');
const response = ref(null);
const status = ref('');
const timeTaken = ref(0);

async function sendRequest() {
  if (!url.value) {
    alert('Please enter a valid URL');
    return;
  }

  response.value = null;
  status.value = '';
  timeTaken.value = 0;

  const options = {
    method: method.value,
    headers: { 'Content-Type': 'application/json' },
  };

  if (method.value !== 'GET' && requestBody.value.trim() !== '') {
    try {
      options.body = JSON.stringify(JSON.parse(requestBody.value));
    } catch (e) {
      alert('Invalid JSON in request body');
      return;
    }
  }

  const start = performance.now();
  try {
    const res = await fetch(url.value, options);
    status.value = `${res.status} ${res.statusText}`;

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      response.value = await res.json();
    } else {
      response.value = await res.text();
    }
  } catch (err) {
    response.value = String(err);
  } finally {
    timeTaken.value = Math.round(performance.now() - start);
  }
}
</script>
