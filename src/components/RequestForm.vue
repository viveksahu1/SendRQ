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
      <button @click="sendRequest" class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send' }}
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
      :loading="loading"
      :error="error"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ResponseView from './ResponseView.vue';

const method = ref('GET');
const url = ref('');
const requestBody = ref('');
const response = ref(null);
const status = ref('');
const timeTaken = ref(0);
const loading = ref(false);
const error = ref(null);

async function sendRequest() {
  if (!url.value) {
    alert('Please enter a valid URL');
    return;
  }

  loading.value = true;
  response.value = null;
  status.value = '';
  timeTaken.value = 0;
  error.value = null;

  const options = {
    method: method.value,
    url: url.value,
    headers: { 'Content-Type': 'application/json' },
  };

  if (method.value !== 'GET' && requestBody.value.trim() !== '') {
    try {
      options.data = JSON.parse(requestBody.value);
    } catch (e) {
      error.value = 'Invalid JSON in request body';
      loading.value = false;
      return;
    }
  }

  const start = performance.now();
  try {
    const res = await axios(options);
    status.value = `${res.status} ${res.statusText}`;
    response.value = res.data;
  } catch (err) {
    error.value = String(err);
    if (err.response) {
      status.value = `${err.response.status} ${err.response.statusText}`;
      response.value = err.response.data;
    }
  } finally {
    timeTaken.value = Math.round(performance.now() - start);
    loading.value = false;
  }
}
</script>