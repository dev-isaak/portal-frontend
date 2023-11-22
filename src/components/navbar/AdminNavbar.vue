<template>
  <v-app-bar
    v-if="userRole > 1"
    elevation="0"
    color="#474747"
    class="pl-5"
    height="40"
    absolute
  >
    <StatusIcon />
    <slot></slot>
  </v-app-bar>
</template>

<script setup lang="ts">
/**
 * The navbar displayed for admin features
 * @displayName Admin navigation bar
 */

import StatusIcon from '@/components/navbar/StatusIcon.vue';
import { useAuthStore } from '@/store/authStore';
import { onMounted, ref } from 'vue';

const auth = useAuthStore();
const userRole = ref();

onMounted(async () => {
  await auth.getUserRole();
  userRole.value = auth.role;
});
</script>
