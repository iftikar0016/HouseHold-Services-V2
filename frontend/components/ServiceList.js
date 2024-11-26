import EditService from "./EditService.js";

export default {
    template: `
        <div>
            <div class="card">
                <div class="tableMain">
                    <table class="table table-hover table-bordered">
                        <thead class="table-light">
                         
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Base Price</th>
                                <th scope="col">Action</th>
                        
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(service, index) in services" :key="service.id">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ service.name }}</td>
                                <td>{{ service.description }}</td>
                                <td>₹ {{ service.price }}</td>
                                <td>
                                    <div style="display:flex; justify-content: space-around" >
                                        <button class="button-30" @click="showModal(service)">Edit Service</button>
                                        <button class="button-30" @click="deleteService(service.id)">
                                        <i class="fa-solid fa-trash-can" style="color: rgb(236, 236, 236);  font-size: 20px;"></i>
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Edit Service Modal -->
            <EditService :service="selectedService" @save="updateService"></EditService>
        </div>
    `,

    data() {
        return {
            services: [],
            selectedService: null
        };
    },

    methods: {
        async deleteService(id){
            const res = await fetch(location.origin + '/delete_service/' + id, {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok){
                this.fetchServices()
            }
        }
        ,
        async fetchServices() {
            const res = await fetch(location.origin + '/api/services', {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            this.services = await res.json();
        },

        showModal(service) {
            this.selectedService = service;
            const modalElement = document.getElementById('editServiceModal');
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
        },

        async updateService(updatedService) {
            // Handle service update logic here
            const res = await fetch(location.origin+'/editservice/' + this.selectedService.id, 
              {method : 'POST', 
                  headers: {'Content-Type' : 'application/json',
                            'Authentication-Token': this.$store.state.auth_token
                  }, 
                  body : JSON.stringify(updatedService)
              })
          if (res.ok){
            console.log('Service updated:', updatedService);
            await this.fetchServices();
          }
          
        }
    },

    async mounted() {
        await this.fetchServices();
    },

    components: {
        EditService
    }
};
