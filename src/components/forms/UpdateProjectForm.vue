<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <v-form>
    <v-container class="d-flex flex-wrap justify-lg-space-between">
      <!--
          <CalendarDatePicker
            @date="receivedDate"
            :v-model="$emit('selectedDate', selectedData.parsedDate.value)"
          />
      -->
      <v-table class="w-75 ma-auto my-6" min-width="200">
        <tbody>
          <tr>
            <td>
              <h3>Project Name</h3>
            </td>
            <td>
              <p v-if="!projectNameEdit" class="mx-6">{{ projectName }}</p>
              <v-text-field
                v-else
                label="New Name"
                v-model="selectedProjectName"
                variant="underlined"
              ></v-text-field>
            </td>
            <td>
              <PrimaryButton
                v-if="!projectNameEdit"
                variant="text"
                @click="projectNameEdit = !projectNameEdit"
                icon="mdi-pencil"
              />
              <v-container v-else>
                <PrimaryButton
                  variant="text"
                  icon="mdi-check"
                  @click="handleUpdateProjectName"
                />
                <PrimaryButton
                  variant="text"
                  icon="mdi-close"
                  @click="projectNameEdit = !projectNameEdit"
                />
              </v-container>
            </td>
          </tr>
          <tr>
            <td>
              <h3>Provider</h3>
            </td>
            <td>
              <p v-if="!providerEdit" class="mx-6">{{ coesiaProvider }}</p>
              <v-select
                v-else
                label="Select Provider"
                :items="customerStore.coesiaProviders"
                v-model="providerName"
                variant="underlined"
              ></v-select>
            </td>
            <td>
              <PrimaryButton
                v-if="!providerEdit"
                variant="text"
                @click="providerEdit = !providerEdit"
                icon="mdi-pencil"
              />
              <v-container v-else>
                <PrimaryButton
                  variant="text"
                  icon="mdi-check"
                  @click="handleUpdateCoesiaProvider"
                />
                <PrimaryButton
                  variant="text"
                  icon="mdi-close"
                  @click="providerEdit = !providerEdit"
                />
              </v-container>
            </td>
          </tr>
          <tr>
            <td>
              <h3>Customer</h3>
            </td>
            <td>
              <p v-if="!customerEdit" class="mx-6">{{ customerName }}</p>
              <v-select
                v-else
                label="Select Customer"
                :items="customerStore.customers"
                v-model="selectedCustomerName"
                variant="underlined"
              >
              </v-select>
            </td>
            <td>
              <PrimaryButton
                v-if="!customerEdit"
                variant="text"
                @click="customerEdit = !customerEdit"
                icon="mdi-pencil"
              />
              <v-container v-else>
                <PrimaryButton
                  variant="text"
                  icon="mdi-check"
                  @click="handleUpdateCustomerName"
                />
                <PrimaryButton
                  variant="text"
                  icon="mdi-close"
                  @click="customerEdit = !customerEdit"
                />
              </v-container>
            </td>
          </tr>
          <tr>
            <td>
              <h3>Machine Type</h3>
            </td>
            <td>
              <p v-if="!machineTypeEdit" class="mx-6">{{ machineType }}</p>
              <v-text-field
                v-else
                label="Machine Type"
                v-model="selectedMachineType"
                variant="underlined"
              ></v-text-field>
            </td>
            <td>
              <PrimaryButton
                v-if="!machineTypeEdit"
                variant="text"
                @click="machineTypeEdit = !machineTypeEdit"
                icon="mdi-pencil"
              />
              <v-container v-else>
                <PrimaryButton
                  variant="text"
                  icon="mdi-check"
                  @click="handleUpdateMachineType"
                />
                <PrimaryButton
                  variant="text"
                  icon="mdi-close"
                  @click="machineTypeEdit = !machineTypeEdit"
                />
              </v-container>
            </td>
          </tr>
          <tr>
            <td>
              <h3>Serial Number</h3>
            </td>
            <td>
              <p v-if="!serialNumberEdit" class="mx-6">{{ serialNumber }}</p>
              <v-text-field
                v-else
                label="New Serial Number"
                v-model="selectedSerialNumber"
                variant="underlined"
              ></v-text-field>
            </td>
            <td>
              <PrimaryButton
                v-if="!serialNumberEdit"
                variant="text"
                @click="serialNumberEdit = !serialNumberEdit"
                icon="mdi-pencil"
              />
              <v-container v-else>
                <PrimaryButton
                  variant="text"
                  icon="mdi-check"
                  @click="handleUpdateSerialNumber"
                />
                <PrimaryButton
                  variant="text"
                  icon="mdi-close"
                  @click="serialNumberEdit = !serialNumberEdit"
                />
              </v-container>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, defineProps } from 'vue';
import type { Ref } from 'vue';
import { useCustomerStore } from '@/store/customerStore';
import { useProjectsStore } from '@/store/projectsStore';
//import CalendarDatePicker from "@/components/calendar/CalendarDatePicker.vue";
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';

/** Init stores */
const customerStore = useCustomerStore();
const projectsStore = useProjectsStore();

/** Binding */
const projectNameEdit = ref(false),
  providerEdit = ref(false),
  customerEdit = ref(false),
  machineTypeEdit = ref(false),
  serialNumberEdit = ref(false),
  message = ref(''),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  selectedProjectName: Ref<string | null> = ref(''),
  selectedCustomerName: Ref<string | null> = ref(''),
  selectedMachineType: Ref<string | null> = ref(''),
  selectedSerialNumber: Ref<string | null> = ref(''),
  selectedProviderName: Ref<string | null> = ref(''),
  // parsedDate = ref(''),
  uploadSuccess = ref(false),
  providerName: Ref<string | null> = ref('');

const props = defineProps({
  projectName: String,
  customerName: String,
  coesiaProvider: String,
  machineType: String,
  serialNumber: String,
  selectedDatePicker: String,
  message: String,
  projectPosted: Boolean,
  uploadSuccess: Boolean,
  projectId: String,
});

onBeforeMount(async () => {
  await customerStore.getCustomers();
  selectedProviderName.value = await customerStore.getCoesiaProviders();
});
/*
const receivedDate = (date) => {
  selectedData.parsedDate.value = date;
}
*/
/*
onUpdated(() => {
  if (props.projectPosted) {
    selectedData.projectName.value = null;
    selectedData.customerName.value = null;
    selectedData.machineType.value = null;
    selectedData.serialNumber.value = null;
    selectedData.parsedDate.value = null;
  }
})
*/
const handleUpdateProjectName = async () => {
  await projectsStore.updateProjectName(
    props.projectId,
    selectedProjectName.value,
    props.customerName,
  );
  uploadSuccess.value = true;
  selectedProjectName.value = null;
  projectNameEdit.value = false;
  message.value = 'Project Name Updated';
  openSnackBar.value = true;
};

const handleUpdateCustomerName = async () => {
  await projectsStore.updateSelectedCustomer(
    props.projectId,
    selectedCustomerName.value,
    props.customerName,
  );
  uploadSuccess.value = true;
  selectedCustomerName.value = null;
  customerEdit.value = false;
  message.value = 'Provider Updated';
  openSnackBar.value = true;
};

const handleUpdateSerialNumber = async () => {
  await projectsStore.updateSerialNumber(
    props.projectId,
    selectedSerialNumber.value,
    props.customerName,
  );
  uploadSuccess.value = true;
  selectedSerialNumber.value = null;
  serialNumberEdit.value = false;
  message.value = 'Serial Number Updated';
  openSnackBar.value = true;
};

const handleUpdateMachineType = async () => {
  await projectsStore.updateMachineType(
    props.projectId,
    selectedMachineType.value,
    props.customerName,
  );
  uploadSuccess.value = true;
  selectedMachineType.value = null;
  machineTypeEdit.value = false;
  message.value = 'Machine Type Updated';
  openSnackBar.value = true;
};

const handleUpdateCoesiaProvider = async () => {
  await projectsStore.updateCoesiaProvider(
    props.projectId,
    providerName.value,
    props.customerName,
  );
  uploadSuccess.value = true;
  providerName.value = null;
  providerEdit.value = false;
  message.value = 'Provider Updated';
  openSnackBar.value = true;
};
</script>
