import ServiceRemarks from "../components/ServiceRemarks.js";
import Services from "../components/Services.js";

export default {
    template: `
        <div>
            <Services></Services>

            <!-- Search Box for Requests -->
            <form @submit.prevent="searchRequests" style="padding: 30px 200px 0 300px;">
                <div class="input-group mb-3">
                    <input 
                        v-model="requestQuery" 
                        type="text" 
                        class="form-control" 
                        placeholder="Search Requests"
                        aria-label="Search Requests"
                    />
                    <button class="btn btn-outline-secondary" type="submit">Search</button>
                </div>
            </form>

            <!-- Service History Table -->
            <section class="container mt-5">
                <h3>Service History</h3>
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        
                            <th>ID</th>
                            <th>Service ID</th>
                            <th>Service Name</th>
                            <th>Professional Name</th>
                            <th>Date of Request</th>
                            <th>Status</th>
                        
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(service,index) in filteredServiceHistory" 
                            :key="service.id"
                        >
                        <th scope="row">{{ index + 1 }}</th>
                            <td>{{ service.id }}</td>
                            <td>{{ service.service_name }}</td>
                            <td>{{ service.professional_name }}</td>
                            <td>{{ service.date_of_request }}</td>
                            <td>
                                <template v-if="service.status === 'closed'">
                                    Closed
                                </template>
                                <template v-else-if="service.status === 'rejected'">
                                    Rejected
                                </template>
                                <template v-else-if="service.status === 'requested'">
                                    <button @click="cancelService(service.id)" class="button-30" style='color:black; background-color:white'>Cancel it?</button>
                                </template>
                                <template v-else>
                                    <button class='button-29'
                                        @click="showModal(service)"
                                    >
                                        Close it?
                                    </button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <ServiceRemarks :service="selectedService" @save="updateService"></ServiceRemarks>

        </div>
    `,

    data() {
        return {
            requestQuery: '',
            serviceHistory: [], 
            selectedService: 'null'
        };
    },

    methods: {
        showModal(service) {
            this.selectedService = service;
            const modalElement = document.getElementById('serviceRemarksModal');
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
        },
        async updateService(updatedService) {
           
            const res = await fetch(location.origin+'/service_remarks/' + this.selectedService.id, 
              {method : 'POST', 
                  headers: {'Content-Type' : 'application/json',
                            'Authentication-Token': this.$store.state.auth_token
                  }, 
                  body : JSON.stringify(updatedService)
              })

              if (res.ok){
                this.fetchServicesRequests()
              }
            },
            async cancelService(id) {
           
                const res = await fetch(location.origin+'/cancel_service/' + id, 
                  {
                      headers: {'Content-Type' : 'application/json',
                                'Authentication-Token': this.$store.state.auth_token
                      }, 
                  })
    
                  if (res.ok){
                    this.fetchServicesRequests()
                  }
                },

        // async searchRequests() {
        //     // API call for searching requests
        //     const res = await fetch(`/search_req/${this.$store.state.user_id}?result=${this.requestQuery}`);
        //     if (res.ok) {
        //         this.serviceHistory = await res.json();
        //     }
        // },

        // All Service Requests History of User
        async fetchServicesRequests() {
            const res = await fetch(location.origin + '/api/services_requests/' + `${this.$store.state.user_id}`, {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok){
                this.serviceHistory = await res.json();
            }
            
        }
    },
    computed: {
        filteredServiceHistory() { if (!this.requestQuery) return this.serviceHistory; 
            const lowerQuery = this.requestQuery.toLowerCase();
             return this.serviceHistory.filter(service => service.service_name.toLowerCase().includes(lowerQuery) || service.professional_name.toLowerCase().includes(lowerQuery) || service.id.toString().includes(lowerQuery) || service.service_id.toString().includes(lowerQuery) || service.date_of_request.toLowerCase().includes(lowerQuery) || service.status.toLowerCase().includes(lowerQuery) ); }
      },

    async mounted() {
        
        await this.fetchServicesRequests()
    },

    components : {
        Services,
        ServiceRemarks,
    }
};
