export default {
    template : `
        <div>
            <main style="margin: 30px;">
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist" style="padding: 20px;">
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" 
                  :class="{ active: activeTab === 'requested-services' }" 
                  @click="activeTab = 'requested-services'"
                  type="button"
                  role="tab">
                  Requested Services
                </button>
              </li>
              <li class="nav-item" role="presentation" style="margin-left: 10px;">
                <button 
                  class="nav-link" 
                  :class="{ active: activeTab === 'closed-services' }" 
                  @click="activeTab = 'closed-services'"
                  type="button"
                  role="tab">
                  Closed Services
                </button>
              </li>
            </ul>
        
            <div class="tab-content">
              <!-- Requested Services Tab -->
              <div 
                class="tab-pane fade" 
                :class="{ 'show active': activeTab === 'requested-services' }"
                id="requested-services" 
                role="tabpanel">
                <div class="tableMain">
                  <table class="table table-hover table-bordered">
                    <thead class="table-light">
                     
                        <th scope="col">ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Location</th>
                        <th scope="col">Date of Request</th>
                        <th scope="col">Action</th>
                      
                    </thead>
                    <tbody>
                      <tr v-for="(service, index) in requestedServices" :key="service.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ service.customer_name }}</td>
                        <td>{{ service.address }}</td>
                        <td>{{ service.date_of_request }}</td>
                        <td>
                          <template v-if="service.status === 'requested'">
                            <button 
                              class='button-29'
                              @click="acceptService(service.id)">
                              Accept
                            </button>
                            <button 
                              style="background-color:red; margin-left:10px" class='button-30' 
                              @click="rejectService(service.id)">
                              Reject
                            </button>
                          </template>
                          <template v-else-if="service.status === 'closed'">Closed</template>
                          <template v-else-if="service.status === 'accepted'">Accepted</template>
                          <template v-else>Rejected</template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
        
              <!-- Closed Services Tab -->
              <div 
                class="tab-pane fade" 
                :class="{ 'show active': activeTab === 'closed-services' }"
                id="closed-services" 
                role="tabpanel">
                <div class="tableMain">
                  <table class="table table-hover table-bordered">
                    <thead>
                      
                        <th scope="col">ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Location</th>
                        <th scope="col">Date of Request</th>
                        <th scope="col">Date of Completion</th>
                        <th scope="col">Remarks</th>
                      
                    </thead>
                    <tbody>
                      <tr v-for="(service, index) in closedServices" :key="service.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ service.customer_name }}</td>
                        <td>{{ service.address }}</td>
                        <td>{{ service.date_of_request }}</td>
                        <td>{{ service.date_of_completion }}</td>
                        <td>{{ service.remarks }}</td>
  
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        
        </div>
    `
,
data() {
    return {
      activeTab: 'requested-services', // tracks which tab is active
      services: [], // services fetched fromm the api....
    };
  },
  computed: {
    requestedServices() {
      return this.services.filter((service) => service.status !== 'closed');
    },
    closedServices() {
      return this.services.filter((service) => service.status === 'closed');
    },
  },
  methods: {
    async fetchServices() {
      try {
        const res = await fetch(location.origin + '/api/services_requests/' + `${this.$store.state.user_id}`, {
          headers: {
              'Authentication-Token': this.$store.state.auth_token
          }
      });
        if (res.ok) {
          this.services = await res.json();
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    async acceptService(serviceId) {
      const res = await fetch(`/accept_req/${serviceId}`, { method: 'GET',
        headers: {
          'Authentication-Token': this.$store.state.auth_token
      }
       });
      if (res.ok) {
          console.log(`Accepted service with ID: ${serviceId}`);
          this.fetchServices(); 
      }
      
    },
    async rejectService(serviceId) {
      
      const res = await fetch(`/reject_req/${serviceId}`, { method: 'GET',
        headers: {
          'Authentication-Token': this.$store.state.auth_token
      }
       });
      if (res.ok) {
          console.log(`Accepted service with ID: ${serviceId}`);
          this.fetchServices(); 
      }
    },
    editService(serviceId) {
      console.log(`Editing service with ID: ${serviceId}`);
      // Opens modal.... 
    },
  },
  mounted() {
    this.fetchServices();
  },

}