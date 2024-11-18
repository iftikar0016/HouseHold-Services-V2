export default {
    template :`
    <div class="card">
        <div class="card-header">
        <h4>Professionals</h4>
        </div>
        <h3>Manage Professionals</h3>
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
              <tr v-for="(prof, index) in professionals" :key="prof.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ prof.fullname }}</td>
                <td>{{ professionals }}</td>
                <td>{{ prof.pincode }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
    </div>
    `,
    data(){
        return {
            professionals: []
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
        const res = await fetch(location.origin + '/api/professionals', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })

        this.professionals = await res.json()
    },
    components : {
    }

}