export default {
    template :`
    <div class="card">
        <div class="container mt-5">
          <table class="table table-hover table-bordered">
            <thead class="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Service Name</th>
                <th scope="col">Pin Code</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(service, index) in services" :key="service.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ service.name }}</td>
                <td>{{ service.professional_name }}</td>
                <td>{{ service.date_of_request }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
    </div>
    `,
    data(){
        return {
            services: [
              ]
        }
    },
    methods: {
      async approveProfessional(id) {
          alert(`Approving professional with ID ${id}`)
          // Add logic to approve professional
      },
      async blockProfessional(id) {
          alert(`Blocking professional with ID ${id}`)
          // Add logic to block professional
      },
      
      async fetchServices() {
          const res = await fetch(location.origin + '/api/services', {
              headers: {
                  'Authentication-Token': this.$store.state.auth_token
              }
          });
  
          this.services = await res.json();
      }
  },
  async mounted() {
    await this.fetchServices();
  }

  

}