<template>
  <v-form>
    <v-container class="d-flex">
      <v-col>
        <v-text-field
          label="Project Name"
          v-model="selectedData.projectName.value"
          @update:modelValue="
            $emit('selectedName', selectedData.projectName.value)
          "
          :rules="[validation.required]"
          clearable
        ></v-text-field>
        <v-select
          :items="customerStore.coesiaProviders"
          v-model="selectedData.selectedCoesiaProvider.value"
          @update:modelValue="
            $emit('selectedProvider', selectedData.selectedCoesiaProvider.value)
          "
          label="Provider"
          :rules="[validation.required]"
        >
        </v-select>
        <v-select
          :items="customerStore.customers"
          v-model="selectedData.customerName.value"
          @update:modelValue="
            $emit('selectedCustomer', selectedData.customerName.value)
          "
          label="Customer"
          :rules="[validation.required]"
        >
        </v-select>
        <v-text-field
          label="Machine Type"
          v-model="selectedData.machineType.value"
          @update:modelValue="
            $emit('selectedMachineType', selectedData.machineType.value)
          "
          clearable
        ></v-text-field>
        <v-text-field
          label="Serial Number"
          v-model="selectedData.serialNumber.value"
          @update:modelValue="
            $emit('selectedSerialNumber', selectedData.serialNumber.value)
          "
          :rules="[validation.required]"
          clearable
        ></v-text-field>
      </v-col>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, defineProps, onUpdated } from 'vue';
import { useCustomerStore } from '@/store/customerStore.ts';
/**
 * Init stores
 */
const customerStore = useCustomerStore();
/**
 * Binding
 */
const selectedData = {
  projectName: ref(''),
  customerName: ref(''),
  machineType: ref(''),
  serialNumber: ref(''),
  selectedCoesiaProvider: ref(''),
  parsedDate: ref(''),
};

const props = defineProps({
  projectName: String,
  customerName: String,
  machineType: String,
  serialNumber: String,
  selectedDatePicker: String,
  projectPosted: Boolean,
  uploadSuccess: Boolean,
  coesiaProvider: String,
});
/**
 * Form fields validation
 */
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

const receivedDate = (date) => {
  selectedData.parsedDate.value = date;
};
onUpdated(() => {
  //If project is posted succesfully, then empty all the fields
  if (props.projectPosted) {
    selectedData.projectName.value = null;
    selectedData.customerName.value = null;
    selectedData.machineType.value = null;
    selectedData.serialNumber.value = null;
    selectedData.parsedDate.value = null;
  }
});
</script>
