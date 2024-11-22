import EditService from "./EditService.js";

export default {
    template: `
        <div>
            <div class="card">
                <div class="container mt-5">
                    <table class="table table-hover table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Service Name</th>
                                <th scope="col">Date of Request</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(service, index) in services" :key="service.id">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ service.name }}</td>
                                <td>{{ service.professional_name }}</td>
                                <td>{{ service.date_of_request }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="showModal(service)">Edit Service</button>
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
