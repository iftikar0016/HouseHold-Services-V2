import AddService from "../components/AddService.js";
import ProfessionalsList from "../components/ProfessionalsList.js";
import ServiceList from "../components/ServiceList.js";

export default {
    template : `

                      <!-- Admin Tabs Section -->
<div class="container mt-5">
    <!-- <h2>Manage Services, Professionals, Service Requests</h2> -->
        <ul class="nav nav-tabs" id="adminTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="services-tab" data-bs-toggle="tab" data-bs-target="#services" type="button" role="tab" aria-controls="services" aria-selected="true">Services</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="professionals-tab" data-bs-toggle="tab" data-bs-target="#professionals" type="button" role="tab" aria-controls="professionals" aria-selected="false">Professionals</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="service-requests-tab" data-bs-toggle="tab" data-bs-target="#service-requests" type="button" role="tab" aria-controls="service-requests" aria-selected="false">Service Requests</button>
            </li>
        </ul>

    <!-- Tab Content -->
    <div class="tab-content mt-3" id="adminTabContent">
        <!-- Services Tab -->
        <div class="tab-pane fade show active" id="services" role="tabpanel" aria-labelledby="services-tab">
            <h3 style="display: flex; justify-content: center; padding-bottom: 5px;">Manage Services</h3>
            <!-- Add table or functionality to manage services here -->
            
                <button class="button-29" role="button" style="padding: 20px; font-size: 28px;" @click="AddServiceAction" ><span style="padding-right: 10px;">Add Service</span> <i class="fa-solid fa-plus" style="font-size: 30px;"></i></button>
                <AddService v-if="showAddService"
                    @AddServiceAction="AddServiceAction"
                    @updated="updateService"
                ></AddService>

            <!-- all the services are here -->
            <ServiceList ref="servicetable"></ServiceList>
                
        </div>


        <!-- Professionals Tab -->
        <div class="tab-pane fade" id="professionals" role="tabpanel" aria-labelledby="professionals-tab">
            <h3>Manage Professionals</h3>


            <!-- Add table or functionality to manage professionals here -->
            <ProfessionalsList></ProfessionalsList>

        </div>


        <!-- Service Requests Tab -->
        <div class="tab-pane fade" id="service-requests" role="tabpanel" aria-labelledby="service-requests-tab">
            <h3>Manage Service Requests</h3>
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
            <!-- Service Req Table -->
            <section class="container mt-5">
                <h3>Service History</h3>
                <table class="table table-hover table-bordered">
                    <thead class="table-light">
                        
                            <th>ID</th>
                            <th>Service Name</th>
                            <th>Customer Name</th>
                            <th>Professional Name</th>
                            <th>Date of Request</th>
                            <th>Status</th>
                            <th>Action</th>
                        
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(service,index) in filteredServiceHistory" 
                            :key="service.id"
                        >
                        <th scope="row">{{ index + 1 }}</th>
                            <td>{{ service.service_name }}</td> 
                            <td>{{ service.customer_name }}</td>
                            <td>{{ service.professional_name }}</td>
                            <td>{{ service.date_of_request }}</td>
                            <td>
                                {{service.status}}
                            </td>
                            <td v-if="service.status=='closed'">
                                <button class="btn" @click="create_csv(service.id)">Download</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

        </div>
    </div>
</div>
    `,
    data(){
        return{
            showAddService: false,
            requestQuery: '',
            serviceHistory: [] 
        }
    },
    methods: {
        AddServiceAction(){
            this.showAddService=!this.showAddService
        },

        updateService(){
            this.$refs.servicetable.fetchServices();
      },

        // All Service Requests History of User
        async fetchServicesRequests() {
            const res = await fetch(location.origin + '/api/service_requests', {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok){
                this.serviceHistory = await res.json();
            }
            
        },
        async create_csv(id){
            const res = await fetch(location.origin + '/create-csv/' + id,
                {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                }
            )
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}`)
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)
            
        },
    },
    components : {
        ProfessionalsList,
        ServiceList,
        AddService,
    },
    computed: {
        filteredServiceHistory() { if (!this.requestQuery) return this.serviceHistory; 
            const lowerQuery = this.requestQuery.toLowerCase();
             return this.serviceHistory.filter(service => service.service_name.toLowerCase().includes(lowerQuery) || service.professional_name.toLowerCase().includes(lowerQuery) || service.id.toString().includes(lowerQuery) || service.service_id.toString().includes(lowerQuery) || service.date_of_request.toLowerCase().includes(lowerQuery) || service.status.toLowerCase().includes(lowerQuery) || service.status.toLowerCase().includes(lowerQuery) ); }
      },


      async mounted() {
        // Fetch initial data for services and service history
        await this.fetchServicesRequests()
    },

}