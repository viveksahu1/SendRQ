<template>
  <div>
    <div class="flex space-x-2 mb-4">
      <select v-model="method" class="border rounded p-2 w-24 bg-gray-700 text-white">
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <input
        v-model="url"
        type="text"
        placeholder="https://api.example.com/data"
        class="flex-1 border rounded p-2 bg-gray-700 text-white"
      />
      <button @click="sendRequest" class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send' }}
      </button>
    </div>

    <div class="tabs mb-4">
      <button @click="activeTab = 'headers'" :class="{ 'active-tab': activeTab === 'headers' }">Headers</button>
      <button @click="activeTab = 'body'" :class="{ 'active-tab': activeTab === 'body' }">Body</button>
    </div>

    <div v-if="activeTab === 'headers'">
      <div v-for="(header, index) in headers" :key="index" class="flex space-x-2 mb-2">
        <input v-model="header.key" type="text" placeholder="Key" class="flex-1 border rounded p-2 bg-gray-700 text-white" />
        <input v-model="header.value" type="text" placeholder="Value" class="flex-1 border rounded p-2 bg-gray-700 text-white" />
        <button @click="removeHeader(index)" class="bg-red-600 text-white px-4 py-2 rounded">-</button>
      </div>
      <button @click="addHeader" class="bg-green-600 text-white px-4 py-2 rounded">+</button>
    </div>

    <div v-if="activeTab === 'body' && method !== 'GET'">
      <textarea
        v-model="requestBody"
        rows="6"
        class="w-full border rounded p-2 font-mono bg-gray-700 text-white"
        placeholder='{"key":"value"}'
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  requestData: Object,
});

const emit = defineEmits(['request-sent']);

const method = ref('GET');
const url = ref('');
const requestBody = ref('');
const loading = ref(false);
const activeTab = ref('body');
const headers = ref([{ key: 'Content-Type', value: 'application/json' }]);

watch(() => props.requestData, (newVal) => {
  if (newVal) {
    method.value = newVal.method;
    url.value = newVal.url;
    requestBody.value = newVal.requestBody;
    headers.value = newVal.headers || [{ key: 'Content-Type', value: 'application/json' }];
  }
}, { immediate: true, deep: true });

function addHeader() {
  headers.value.push({ key: '', value: '' });
}

function removeHeader(index) {
  headers.value.splice(index, 1);
}

async function sendRequest() {
  if (!url.value) {
    alert('Please enter a valid URL');
    return;
  }

  loading.value = true;
  let response = null;
  let status = '';
  let timeTaken = 0;
  let error = null;

  const requestHeaders = headers.value.reduce((acc, header) => {
    if (header.key) {
      acc[header.key] = header.value;
    }
    return acc;
  }, {});

  const options = {
    method: method.value,
    url: url.value,
    headers: requestHeaders,
  };

  if (method.value !== 'GET' && requestBody.value.trim() !== '') {
    try {
      options.data = JSON.parse(requestBody.value);
    } catch (e) {
      error = 'Invalid JSON in request body';
      loading.value = false;
      emit('request-sent', { method: method.value, url: url.value, headers: headers.value, requestBody: requestBody.value, response, status, timeTaken, loading: loading.value, error });
      return;
    }
  }

  const start = performance.now();
  try {
    const res = await axios(options);
    status = `${res.status} ${res.statusText}`;
    response = res.data;
  } catch (err) {
    error = String(err);
    if (err.response) {
      status = `${err.response.status} ${err.response.statusText}`;
      response = err.response.data;
    }
  } finally {
    timeTaken = Math.round(performance.now() - start);
    loading.value = false;
    emit('request-sent', { method: method.value, url: url.value, headers: headers.value, requestBody: requestBody.value, response, status, timeTaken, loading: loading.value, error });
  }
}
</script>