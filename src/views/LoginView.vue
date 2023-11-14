<template>
  <v-col class="w-100 d-flex justify-center">
    <v-img
      src="@/assets/volpak.red.coesia.png"
      max-width="400"
      alt="Volpak logo"
      class="mx-5"
      to="/"
    ></v-img>
  </v-col>
  <LoginForm />
</template>

<script setup lang="ts">
import LoginForm from '@/components/login/LoginForm.vue';
</script>
