import { defineStore } from 'pinia';
import { useProjectsStore } from './projectsStore';
import Client from '@/utils/client.ts';

export const useCustomerStore = defineStore('customer', {
  state: () => {
    return {
      currentCustomerName: '',
      currentCustomerEmail: '',
      currentCustomerAdress: '',
      coesiaProvidersList: [],
      customersList: [],
      message: '',
    };
  },
  getters: {
    projectNameTest: (state) => state.currentCustomerName,
    coesiaProviders: (state) => state.coesiaProvidersList,
    customers: (state) => state.customersList,
  },
  actions: {
    async getCustomers() {
      const uri = `/customers`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        const res = await rawResponse.json();
        if (res) {
          this.customersList = res.data.map((customer) => ({
            title: customer.attributes.Name,
            value: customer.id,
          }));
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getCoesiaProviders() {
      const uri = `/coesia-providers`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        const res = await rawResponse.json();
        if (res) {
          this.coesiaProvidersList = res.data.map((provider) => ({
            title: provider.attributes.provider_name,
            value: provider.id,
          }));
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getCurrentCustomer() {
      const uri = `/users/me?populate=*`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        const res = await rawResponse.json();
        if (res != null) {
          this.currentCustomerName = res.username.toUpperCase();
          this.currentCustomerEmail = res.email;
          this.currentCustomerAdress = res.address;
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async postNewCustomer(jwt, name, address, email) {
      const uri = `/customers`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          Name: `${name}`,
          Address: `${address}`,
          Email: `${email}`,
          //hay que enviar correctamente el project
          // para que aparezca al hacer el push
          //en projectsStore
          projects: {
            data: {},
          },
        },
      });
      try {
        const rawResponse = await client.getMethodPost(body);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          const projectsStore = useProjectsStore();
          projectsStore.customerProjects.push(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
