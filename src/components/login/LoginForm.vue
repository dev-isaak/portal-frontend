<template>
  <SnackBar
    :text="authStore.actualErrorMessage"
    :error="isErrorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackbar="openSnackBar = false"
  />
  <v-card max-width="500" class="mx-auto mt-10 pa-10 d-flex flex-column">
    <v-col class="d-flex justify-center mb-5">
      <h1>DOCU<span class="text-red">TECH</span>HUB</h1>
    </v-col>
    <v-form ref="loginForm" @submit.prevent="handleLogin" validate-on="submit">
      <v-text-field
        label="Username or email"
        v-model="selectedUsername"
        :rules="[rules.required]"
        clearable
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="selectedPassword"
        clearable
        :rules="[rules.required]"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        @click:append-inner="showPassword = !showPassword"
      ></v-text-field>
      <v-checkbox label="Remember password"></v-checkbox>
      <v-btn to="/" size="x-small" :ripple="false" variant="plain"
        >Forgot your password?</v-btn
      >
      <v-col class="d-flex flex-column align-center mt-10">
        <PrimaryButton text="Login" type="submit" />
      </v-col>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import SnackBar from '../atoms/SnackBar.vue';

const authStore = useAuthStore();
const router = useRouter();
const selectedUsername = ref('');
const selectedPassword = ref('');
const showPassword = ref(false);
const openSnackBar = ref(false);
const isErrorMessage = ref(false);
const loginForm = ref(null);

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const handleLogin = async () => {
  if (loginForm.value) {
    const formIsValid = await loginForm.value.validate();
    if (formIsValid.valid) {
      const isLogedIn = await authStore.login(
        selectedUsername.value,
        selectedPassword.value,
      );
      if (isLogedIn) {
        router.push('/');
      } else {
        isErrorMessage.value = true;
        openSnackBar.value = true;
      }
    }
  }
};
</script>
