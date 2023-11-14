<template>
  <PrimaryButton
    @click="handleOpenDialog"
    @closeDialog="closeDialog"
    :openDialog="openDialog"
    actionText="Create"
    formDialog
    text="Add New Customer"
    :handleCreateOption="addNewCustomer"
    variant="text"
  >
    <form>
      <h3>Create a new customer</h3>
      <v-divider class="my-4"></v-divider>
      <v-text-field
        label="Customer Name"
        v-model="selectedCustomerName"
        :rules="[rules.required]"
        clearable
      ></v-text-field>
      <v-text-field
        label="Address"
        v-model="selectedAddress"
        clearable
      ></v-text-field>
      <v-col class="d-flex">
        <v-text-field
          label="Email"
          type="email"
          v-model="selectedEmail"
          clearable
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field
          label="Confirm Email"
          type="email"
          v-model="selectedConfirmationEmail"
          class="ml-4"
          clearable
          :rules="[rules.required, rules.emailValidation]"
        ></v-text-field>
      </v-col>
      <h3>Create a new user for this customer</h3>
      <v-divider class="my-4"></v-divider>
      <v-text-field
        label="Username"
        v-model="selectedUserName"
        clearable
        :rules="[rules.required]"
      ></v-text-field>
      <v-col class="d-flex">
        <v-text-field
          label="Password"
          v-model="selectedPassword"
          clearable
          :rules="[rules.required, rules.min]"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          label="Confirm Password"
          v-model="selectedConfirmationPassword"
          class="ml-4"
          clearable
          :rules="[rules.required, rules.passwordValidation]"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword2 ? 'text' : 'password'"
          @click:append-inner="showPassword2 = !showPassword2"
        ></v-text-field>
      </v-col>
    </form>
  </PrimaryButton>
</template>

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useCustomerStore } from '@/store/customerStore.ts';

const customerStore = useCustomerStore();
const rules = {
  required: (value) => !!value || 'Field is required',
  passwordValidation: (value) =>
    value === selectedPassword.value || 'Passwords must be equals',
  emailValidation: (value) =>
    value === selectedEmail.value || 'Emails must be equals',
  min: (value) => value.length >= 8 || 'Min 8 characters',
};

const selectedCustomerName = ref('');
const selectedAddress = ref('');
const selectedEmail = ref('');
const selectedConfirmationEmail = ref('');
const selectedUserName = ref('');
const selectedPassword = ref('');
const selectedConfirmationPassword = ref('');
let showPassword = ref(false);
let showPassword2 = ref(false);
const openDialog = ref(false);

const addNewCustomer = async () => {
  await customerStore.postNewCustomer(
    selectedCustomerName.value,
    selectedAddress.value,
    selectedEmail.value,
  );
};

const handleOpenDialog = () => {
  openDialog.value = true;
};

const closeDialog = () => {
  openDialog.value = false;
};
</script>
