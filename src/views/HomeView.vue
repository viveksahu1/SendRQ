<template>
  <div class="main-layout">
    <div class="sidebar">
      <h2 class="text-lg font-bold mb-4">History</h2>
      <ul>
        <li
          v-for="(req, index) in history"
          :key="index"
          @click="loadRequest(req)"
          class="cursor-pointer p-2 rounded hover:bg-gray-700"
        >
          <span class="font-bold">{{ req.method }}</span>
          <span>{{ req.url }}</span>
        </li>
      </ul>
    </div>
    <div class="main-content">
      <div class="request-panel">
        <RequestForm @request-sent="addToHistory" :request-data="selectedRequest" />
      </div>
      <div class="response-panel">
        <ResponseView
          :response="response"
          :status="status"
          :time-taken="timeTaken"
          :loading="loading"
          :error="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RequestForm from '../components/RequestForm.vue';
import ResponseView from '../components/ResponseView.vue';

const history = ref([]);
const selectedRequest = ref(null);
const response = ref(null);
const status = ref('');
const timeTaken = ref(0);
const loading = ref(false);
const error = ref(null);

function addToHistory(request) {
  history.value.unshift(request);
  response.value = request.response;
  status.value = request.status;
  timeTaken.value = request.timeTaken;
  loading.value = request.loading;
  error.value = request.error;
}

function loadRequest(request) {
  selectedRequest.value = request;
  response.value = request.response;
  status.value = request.status;
  timeTaken.value = request.timeTaken;
  loading.value = request.loading;
  error.value = request.error;
}
</script>