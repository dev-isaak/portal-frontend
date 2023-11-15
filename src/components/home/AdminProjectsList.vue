<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
  />
  <v-text-field
    label="Search project"
    append-inner-icon="mdi-magnify"
    v-model="searchPhrase"
    @update:modelValue="handleSearchProject"
  ></v-text-field>
  <v-sheet>
    <v-expansion-panels variant="inset">
      <v-expansion-panel
        v-for="customer in projectsList"
        :key="customer.id"
        :title="customer.attributes.Name.toUpperCase()"
      >
        <v-expansion-panel-text
          v-for="project in customer.attributes.projects.data"
          :key="project.id"
        >
          <v-container
            class="w-100 px-0 d-flex align-center justify-space-between"
          >
            <v-icon
              icon="mdi-circle-medium"
              :color="
                project.attributes.under_construction ? 'error' : 'success'
              "
            ></v-icon>
            <v-sheet class="d-flex justify-start">
              <v-btn
                class="w-100 px-md-10"
                :to="{ name: 'project', params: { id: project.id } }"
              >
                {{ project.attributes.project_name }}
              </v-btn>
            </v-sheet>
            <v-sheet class="d-flex justify-end">
              <PrimaryButton
                @click="handleOpenEditDialog(project.id)"
                @closeDialog="closeDialog(project.id)"
                :openDialog="openEditDialog[project.id]"
                formDialog
                icon="mdi-file-edit-outline"
                variant="text"
              >
                <UpdateProjectForm
                  :projectName="project.attributes.project_name"
                  :coesiaProvider="
                    project.attributes.coesia_provider.data.attributes
                      .provider_name
                  "
                  :machineType="project.attributes.machine_type"
                  :serialNumber="project.attributes.serial_number"
                  :customerName="customer.attributes.Name"
                  :selectedDatePicker="project.attributes.date"
                  :moduleUnwinder="project.attributes"
                  :projectPosted="selectedData.projectState.value"
                  :message="message"
                  :projectId="project.id"
                  @selectedName="projectName"
                  @selectedCustomer="customerName"
                  @selectedProvider="providerId"
                  @selectedMachineType="machineType"
                  @selectedSerialNumber="serialNumber"
                  @parsedDate="selectedDatePicker"
                />
              </PrimaryButton>
              <PrimaryButton
                @click="handleDeleteFunction(project.id)"
                @closeDialog="closeDialog(project.id)"
                :openDialog="openDeleteDialog[project.id]"
                confirmationDialog
                textDialog="delete the project"
                variant="text"
                icon="mdi-delete-outline"
                iconColor="error"
                :handleTrueOption="() => handleDelete(project.id, customer.id)"
              />
            </v-sheet>
          </v-container>
          <v-divider class="mt-4"></v-divider>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-sheet>
</template>
<script setup lang="ts">
/**
 * Display and manage all the customers and projects.
 * @displayName Customer and Projects list (Only admin role)
 */
import { useProjectsStore } from '@/store/projectsStore.js';
import { ref, defineProps, onMounted } from 'vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import UpdateProjectForm from '@/components/forms/UpdateProjectForm.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';
/**
 * Init Stores
 */
const projectsStore = useProjectsStore();
/**
 * Binding
 */
const searchPhrase = ref('');
const message = ref('');
const projectsList = ref([]);
const errorMessage = ref(false);
const openSnackBar = ref(false);
const openEditDialog = ref({});
const openDeleteDialog = ref({});

onMounted(async () => {
  await projectsStore.getAllCustomerProjects();
  projectsList.value = projectsStore.projects;
});

const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};

const handleOpenEditDialog = (projectId) => {
  openEditDialog.value[projectId] = true;
};

const handleDeleteFunction = (project) => {
  openDeleteDialog.value[project] = true;
};

const closeDialog = (projectId) => {
  openEditDialog.value[projectId] = false;
  openDeleteDialog.value[projectId] = false;
};

defineProps({
  projectName: String,
});

/**
 * When delete button is pressed the file is deleted and the dialog closed
 */
const handleDelete = async (projectId, customerId) => {
  await projectsStore.deleteSelectedProject(projectId, customerId);
  message.value = 'Item deleted successfully';
  openSnackBar.value = true;
  openDeleteDialog.value[projectId] = false;
};
const selectedData = {
  selectedName: ref(''),
  parsedDate: ref(''),
  selectedMachineType: ref(''),
  selectedSerialNumber: ref(''),
  selectedCustomer: ref(''),
  coesiaProvider: ref(''),
  projectState: ref(false),
};

/**
 * Emits from form
 */
const projectName = (e) => (selectedData.selectedName.value = e);
const customerName = (e) => (selectedData.selectedCustomer.value = e);
const machineType = (e) => (selectedData.selectedMachineType.value = e);
const serialNumber = (e) => (selectedData.selectedSerialNumber.value = e);
const selectedDatePicker = (e) => (selectedData.parsedDate.value = e);
const providerId = (e) => (selectedData.coesiaProvider.value = e);

const handleSearchProject = () => {
  const searchQuery = searchPhrase.value.toUpperCase();

  if (searchQuery === '' || searchQuery.length < 1) {
    projectsList.value = projectsStore.projects;
  } else {
    // Hacemos un map de projects donde devolvemos un array con los projectos filtrados
    const filteredProjects = projectsStore.projects.map((project) => {
      const filteredElements = project.attributes.projects.data.filter(
        (element) => {
          return element.attributes.project_name.includes(searchQuery);
        },
      );

      if (filteredElements.length > 0) {
        // Si se encontraron elementos en este proyecto, se añaden los projectos filtrados dentro del projecto
        return {
          ...project,
          attributes: {
            ...project.attributes,
            projects: { data: filteredElements },
          },
        };
      } else {
        return null; // No se encontraron elementos en este proyecto, exclúyelo
      }
    });

    // Eliminar proyectos nulos
    projectsList.value = filteredProjects.filter((project) => project !== null);
  }
};
</script>

<style scoped></style>
