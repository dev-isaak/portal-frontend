import { defineStore } from 'pinia';
import Client from '@/utils/client.ts';
import { useCustomerStore } from './customerStore';

export const useProjectsStore = defineStore('projects', {
  state: () => {
    return {
      projectName: '',
      customerProjects: [],
      message: '',
      currentProjectName: '',
      currentProject: [],
      projectSinoptic: '',
      projectModules: [],
      projectMaintenancePlanFile: '',
      projectMachineType: '',
      projectSerialNumber: '',
      projectUpdateItemId: '',
      warningItems: '',
      trainingState: '',
      selectedCustomerName: '',
      coesiaProvider: '',
    };
  },
  getters: {
    projects: (state) => {
      const sortedProjects = [...state.customerProjects];
      sortedProjects.forEach((e) => {
        e.attributes.projects.data.sort((a, b) => {
          const titleA = a.attributes.project_name.toUpperCase();
          const titleB = b.attributes.project_name.toUpperCase();
          if (titleA < titleB) {
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }
          return 0;
        });
      });
      return sortedProjects;
    },
    currentCoesiaProvider: (state) => state.coesiaProvider,
  },
  actions: {
    async getCustomerProjects() {
      const uri = `/users/me?populate[customer][populate][projects][populate]=*`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.customerProjects = res.customer.projects;
          return res.customer.projects;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getAllCustomerProjects() {
      const uri = `/customers?[populate][projects][populate]=*`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.customerProjects = res.data;
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getProject(projectId) {
      const uri = `/projects/${projectId}?populate=*`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();

        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          //Si no hay se ha subido el arhivo de sinoptic se manda el valor vacio para evitar error
          res.data.attributes.machine_sinoptic.data == null
            ? (this.projectSinoptic = '')
            : (this.projectSinoptic =
                res.data.attributes.machine_sinoptic.data.attributes.url);

          //Si no hay se ha subido el arhivo de maintenance plan se manda el valor vacio para evitar error
          res.data.attributes.maintenance_plan_file.data == null
            ? (this.projectMaintenancePlanFile = '')
            : (this.projectMaintenancePlanFile =
                res.data.attributes.maintenance_plan_file.data.attributes.url);

          this.currentProjectName = res.data.attributes.project_name;
          this.projectModules = res.data.attributes.modules;
          this.projectMachineType = res.data.attributes.machine_type;
          this.projectSerialNumber = res.data.attributes.serial_number;
          this.projectUpdateItemId =
            res.data.attributes.new_update.data != null
              ? res.data.attributes.new_update.data.id
              : '';
          this.warningItems = res.data.attributes.update_lists;
          this.trainingState = res.data.attributes.training_state;
          this.coesiaProvider = res.data.attributes.coesia_provider;
          this.currentProject = res.data;
          return res;
        } else {
          this.coesiaProvider = null;
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async postNewProject(
      name,
      fatDate,
      customer,
      machineType = '',
      serialNumber = '',
      coesiaProvider,
    ) {
      const uri = `/projects`;
      const client = new Client(uri);
      const data = {
        project_name: `${name}`,
        customer: `${customer}`,
        machine_type: `${machineType}`,
        serial_number: `${serialNumber}`,
        modules: [
          {
            module_unwinder: true,
            module_forming: true,
            module_dosing: true,
            module_output: false,
          },
        ],
        coesia_provider: coesiaProvider,
      };
      if (fatDate !== '') {
        data.date = fatDate;
      }
      const body = JSON.stringify({ data });
      try {
        const rawResponse = await client.getMethodPost(body);
        const res = await rawResponse.json();
        if (rawResponse.status === 200) {
          const findProjectName = this.customerProjects.find(
            (name) => name.id == customer,
          );
          findProjectName.attributes.projects.data.push(res.data);
          return true;
        } else {
          this.message = res.error.message;
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteSelectedProject(projectId, customerId) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodDelete();
        if (rawResponse.status === 200) {
          const customer = this.customerProjects.find(
            (idCustomer) => idCustomer.id == customerId,
          );
          const data = customer.attributes.projects.data
            .map((e) => e.id)
            .indexOf(projectId);
          customer.attributes.projects.data.splice(data, 1);
          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateTrainingState(projectId, currentState) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          training_state: `${currentState}`,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        if (rawResponse.status === 200) {
          this.message = 'Training state updated succesfuly';
          return true;
        } else {
          this.message = 'Cannot update training state';
        }
      } catch (e) {
        console.log(e);
      }
    },
    async restoreUpdatePopup(updateItemId) {
      const uri = `/new-updates/${updateItemId}`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          value: false,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        if (rawResponse.status === 200) {
          this.message = 'Training state updated succesfuly';
          return true;
        } else {
          this.message = 'Cannot update training state';
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateProjectName(projectId, projectName, customerName) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);

      const body = JSON.stringify({
        data: {
          project_name: projectName,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        await rawResponse.json();
        if (rawResponse.status === 200) {
          // Search for the customer
          const customer = this.projects.find((customer) => {
            return customer.attributes.Name == customerName;
          });
          // Then search for the project of the customer
          const project = customer.attributes.projects.data.find((project) => {
            return project.id == projectId;
          });
          // Then update the project name
          project.attributes.project_name = projectName;

          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateCoesiaProvider(projectId, selectedProviderId, customerName) {
      const customerStore = useCustomerStore();
      const uri = `/projects/${projectId}?populate=coesia_provider`;
      const client = new Client(uri);
      console.log(customerStore.coesiaProviders);
      const body = JSON.stringify({
        data: {
          coesia_provider: selectedProviderId,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        await rawResponse.json();
        if (rawResponse.status === 200) {
          // Search for the customer
          const customer = this.projects.find((customer) => {
            return customer.attributes.Name == customerName;
          });
          // Then search for the project of the customer
          const project = customer.attributes.projects.data.find((project) => {
            return project.id == projectId;
          });

          // Search the selected provider on the provider list to find the name
          const providerName = customerStore.coesiaProviders.find((e) => {
            if (e.value === selectedProviderId) {
              return e;
            }
          });
          // Change provider name for the new one
          project.attributes.coesia_provider.data.attributes.provider_name =
            providerName.title;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async updateSelectedCustomer(projectId, selectedCustomerId, customerName) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);

      const body = JSON.stringify({
        data: {
          customer: selectedCustomerId,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        await rawResponse.json();
        if (rawResponse.status === 200) {
          // Search for the customer
          const customer = this.projects.find((customer) => {
            return customer.attributes.Name == customerName;
          });
          // Then search for the project of the customer
          const oldProject = customer.attributes.projects.data.find(
            (project) => {
              return project.id == projectId;
            },
          );

          // Push the project on the new customer
          const newProject = this.projects.find((customer) => {
            return customer.id == selectedCustomerId;
          });
          newProject.attributes.projects.data.push(oldProject);

          // Search index of project and delete from the customer.
          customer.attributes.projects.data.forEach((e) => {
            if (e.id == projectId) {
              const projectIndex = customer.attributes.projects.data.indexOf(e);
              customer.attributes.projects.data.splice(projectIndex, 1);
            }
          });

          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateSerialNumber(projectId, serialNumber, customerName) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);

      const body = JSON.stringify({
        data: {
          serial_number: serialNumber,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        await rawResponse.json();
        if (rawResponse.status === 200) {
          // Search for the customer
          const customer = this.projects.find((customer) => {
            return customer.attributes.Name == customerName;
          });
          console.log(customer);
          // Then search for the project of the customer
          const project = customer.attributes.projects.data.find((project) => {
            return project.id == projectId;
          });
          console.log(project);
          // Then update the project name
          project.attributes.serial_number = serialNumber;

          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateMachineType(projectId, machineType, customerName) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);

      const body = JSON.stringify({
        data: {
          machine_type: machineType,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        await rawResponse.json();
        if (rawResponse.status === 200) {
          // Search for the customer
          const customer = this.projects.find((customer) => {
            return customer.attributes.Name == customerName;
          });
          console.log(customer);
          // Then search for the project of the customer
          const project = customer.attributes.projects.data.find((project) => {
            return project.id == projectId;
          });
          console.log(project);
          // Then update the project name
          project.attributes.machine_type = machineType;

          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateProjectStatus(projectId, projectStatus) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          under_construction: `${projectStatus}`,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        if (rawResponse.status === 200) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateModules(projectId, unwinder, filling, forming, output) {
      const uri = `/projects/${projectId}?populate=*`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          modules: [
            {
              module_unwinder: `${unwinder}`,
              module_forming: `${forming}`,
              module_dosing: `${filling}`,
              module_output: `${output}`,
            },
          ],
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          //cambiar el formato
          this.projectModules = res.data.attributes.modules;
          return this.projectModules;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async uploadMaintenacefile(projectId, fileId) {
      const uri = `/projects/${projectId}?populate=maintenance_plan_file`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          maintenance_plan_file: fileId,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        const res = await rawResponse.json();
        if (rawResponse.status === 200) {
          this.projectMaintenancePlanFile =
            res.data.attributes.maintenance_plan_file.data.attributes.url;
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async uploadSinoptic(projectId, fileId) {
      const uri = `/projects/${projectId}?populate=machine_sinoptic`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          machine_sinoptic: fileId,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        const res = await rawResponse.json();
        if (rawResponse.status === 200) {
          this.projectSinoptic =
            res.data.attributes.machine_sinoptic.data.attributes.url;
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
});
