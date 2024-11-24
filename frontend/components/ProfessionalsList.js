export default {
    template :`
     <div>     <!-- search box -->
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

    <div class="card">
        <div class="container mt-5">
          <table class="table table-hover table-bordered">
            <thead class="table-light">
          
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Service Name</th>
                <th scope="col">Pin Code</th>
                <th scope="col">Action</th>
            
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(prof, index) in filteredProfessionals" :key="prof.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ prof.fullname }}</td>
                <td>{{ prof.service_id }}</td>
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
            professionals: [],
            requestQuery: ''
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
    computed: {
      filteredProfessionals() { if (!this.requestQuery) return this.professionals; 
          const lowerQuery = this.requestQuery.toLowerCase();
           return this.professionals.filter(prof => prof.fullname.toLowerCase().includes(lowerQuery) || prof.user_id.toString().includes(lowerQuery) || prof.service_id.toString().includes(lowerQuery) || prof.pincode.toString().includes(lowerQuery)); }
    },


}