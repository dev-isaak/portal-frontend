<template>
  <v-form>
    <v-container class="d-flex">
      <v-col>
        <v-text-field
          label="Project Name"
          v-model="selectedProjectName"
          @update:modelValue="$emit('selectedName', selectedProjectName)"
          :rules="[validation.required]"
          clearable
        ></v-text-field>
        <v-select
          :items="customerStore.coesiaProviders"
          v-model="selectedCoesiaProvider"
          @update:modelValue="$emit('selectedProvider', selectedCoesiaProvider)"
          label="Provider"
          :rules="[validation.required]"
        >
        </v-select>
        <v-select
          :items="customerStore.customers"
          v-model="selectedCustomerName"
          @update:modelValue="$emit('selectedCustomer', selectedCustomerName)"
          label="Customer"
          :rules="[validation.required]"
        >
        </v-select>
        <v-text-field
          label="Machine Type"
          v-model="selectedMachineType"
          @update:modelValue="$emit('selectedMachineType', selectedMachineType)"
          clearable
        ></v-text-field>
        <v-text-field
          label="Serial Number"
          v-model="selectedSerialNumber"
          @update:modelValue="
            $emit('selectedSerialNumber', selectedSerialNumber)
          "
          :rules="[validation.required]"
          clearable
        ></v-text-field>
      </v-col>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, onUpdated } from 'vue';
import type { Ref } from 'vue';
import { useCustomerStore } from '@/store/customerStore';

const props = defineProps<{
  isSuccess: boolean;
}>();

/** Init stores */
const customerStore = useCustomerStore();

/** Binding */
const selectedProjectName: Ref<string | null> = ref(''),
  selectedCustomerName: Ref<string | null> = ref(''),
  selectedMachineType: Ref<string | null> = ref(''),
  selectedSerialNumber: Ref<string | null> = ref(''),
  selectedCoesiaProvider: Ref<string | null> = ref('');
// parsedDate = ref('');

/** Form fields validation */
const validation = {
  required: (value) => !!value || 'Field is required',
};
/**
 * When the component is mounted we fetch the customer list into customerList
 * Returns an array with the customer list
 */
onBeforeMount(async () => {
  await customerStore.getCustomers();
  await customerStore.getCoesiaProviders();
});

// const receivedDate = (date) => {
//   parsedDate.value = date;
// };
onUpdated(() => {
  if (props.isSuccess) {
    selectedProjectName.value = null;
    selectedCustomerName.value = null;
    selectedMachineType.value = null;
    selectedSerialNumber.value = null;
    selectedCoesiaProvider.value = null;
    // parsedDate.value = null;
  }
});
//If project is posted succesfully, then empty all the fields
</script>
