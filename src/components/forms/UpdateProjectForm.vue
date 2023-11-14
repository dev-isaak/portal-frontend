<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
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
                v-model="selectedData.projectName.value"
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
                v-model="selectedData.providerName.value"
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
                v-model="selectedData.customerName.value"
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
                v-model="selectedData.machineType.value"
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
                v-model="selectedData.serialNumber.value"
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
import { useCustomerStore } from '@/store/customerStore.ts';
import { useProjectsStore } from '@/store/projectsStore.ts';
//import CalendarDatePicker from "@/components/calendar/CalendarDatePicker.vue";
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';
/**
 * Init stores
 */
const customerStore = useCustomerStore();
const projectsStore = useProjectsStore();
/**
 * Binding
 */
const projectNameEdit = ref(false);
const providerEdit = ref(false);
const customerEdit = ref(false);
const machineTypeEdit = ref(false);
const serialNumberEdit = ref(false);
const message = ref('');
const openSnackBar = ref(false);
const errorMessage = ref(false);

const selectedData = {
  projectName: ref(''),
  customerName: ref(''),
  machineType: ref(''),
  serialNumber: ref(''),
  customerList: ref([]),
  parsedDate: ref(''),
  uploadSuccess: ref(false),
  providerName: ref(''),
  selectedProviderName: ref(''),
};

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
  selectedData.selectedProviderName.value =
    await customerStore.getCoesiaProviders();
});

const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};
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
    selectedData.projectName.value,
    props.customerName,
  );
  selectedData.uploadSuccess.value = true;
  selectedData.projectName.value = null;
  projectNameEdit.value = false;
  message.value = 'Project Name Updated';
  openSnackBar.value = true;
};

const handleUpdateCustomerName = async () => {
  await projectsStore.updateSelectedCustomer(
    props.projectId,
    selectedData.customerName.value,
    props.customerName,
  );
  selectedData.uploadSuccess.value = true;
  selectedData.customerName.value = null;
  customerEdit.value = false;
  message.value = 'Provider Updated';
  openSnackBar.value = true;
};

const handleUpdateSerialNumber = async () => {
  await projectsStore.updateSerialNumber(
    props.projectId,
    selectedData.serialNumber.value,
    props.customerName,
  );
  selectedData.uploadSuccess.value = true;
  selectedData.serialNumber.value = null;
  serialNumberEdit.value = false;
  message.value = 'Serial Number Updated';
  openSnackBar.value = true;
};

const handleUpdateMachineType = async () => {
  await projectsStore.updateMachineType(
    props.projectId,
    selectedData.machineType.value,
    props.customerName,
  );
  selectedData.uploadSuccess.value = true;
  selectedData.machineType.value = null;
  machineTypeEdit.value = false;
  message.value = 'Machine Type Updated';
  openSnackBar.value = true;
};

const handleUpdateCoesiaProvider = async () => {
  await projectsStore.updateCoesiaProvider(
    props.projectId,
    selectedData.providerName.value,
    props.customerName,
  );
  selectedData.uploadSuccess.value = true;
  selectedData.providerName.value = null;
  providerEdit.value = false;
  message.value = 'Provider Updated';
  openSnackBar.value = true;
};
</script>
