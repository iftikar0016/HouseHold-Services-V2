export default {
    template :`
    <div class="card">
        <div class="card-header">
        </div>
        <h3>Services</h3>
        <div class="tableMain">
          <table class="table">
            <thead>
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
                <td>{{ services }}</td>
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
                { id: 1, name: 'John Doe', status: 'Pending' },
                { id: 2, name: 'Jane Smith', status: 'Approved' },
              ]
        }
    },
    methods : {
        approveProfessional(id) {
            alert(`Approving professional with ID ${id}`)
            // Add logic to approve professional
          },
          blockProfessional(id) {
            alert(`Blocking professional with ID ${id}`)
            // Add logic to block professional
          },
    },
    async mounted(){
        const res = await fetch(location.origin + '/api/services', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })

        this.services = await res.json()
    },
    components : {
    }

}