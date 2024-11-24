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
                                    Requested
                                </template>
                                <template v-else>
                                    <button 
                                        @click="closeService(service.id)" 
                                        class="btn btn-sm btn-success"
                                    >
                                        Close it?
                                    </button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    `,

    data() {
        return {
            requestQuery: '',
            serviceHistory: [] // Array for service history
        };
    },

    methods: {


        async searchRequests() {
            // API call for searching requests
            const res = await fetch(`/search_req/${this.$store.state.user_id}?result=${this.requestQuery}`);
            if (res.ok) {
                this.serviceHistory = await res.json();
            }
        },

        async closeService(serviceId) {
            // API call to close a service
            const res = await fetch(`/service_remarks/${serviceId}`, { method: 'POST' });
            if (res.ok) {
                console.log(`Service ${serviceId} closed successfully`);
                this.fetchServiceHistory(); // Refresh service history
            }
        },

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
        // Fetch initial data for services and service history
        await this.fetchServicesRequests()
    },

    components : {
        Services,
    }
};
