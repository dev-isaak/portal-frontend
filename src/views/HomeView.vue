<template>
  <HomeLayout>
    <div v-if="role !== 1">
      <AdminProjects />
    </div>
    <div v-else>
      <h1>{{ userName }}</h1>
      <CustomerProjects />
    </div>
  </HomeLayout>
</template>

<script setup>
import HomeLayout from '@/layouts/HomeLayout.vue';
import CustomerProjects from '@/components/home/CustomerProjects.vue';
import { useAuthStore } from '@/store/authStore.js';
import { ref, onBeforeMount } from 'vue';
import { useCustomerStore } from '@/store/customerStore';
import AdminProjects from '@/components/home/AdminProjects.vue';

const storeAuth = useAuthStore();
const storeCustomer = useCustomerStore();
const userName = ref('');
const role = ref();

onBeforeMount(async () => {
  role.value = await storeAuth.getUserRole();
  const data = await storeCustomer.getCurrentCustomer();
  if (data) {
    userName.value = storeCustomer.currentCustomerName;
  }
});
</script>

<style scoped></style>
