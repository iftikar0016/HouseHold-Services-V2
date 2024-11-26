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
                <th scope="col">Service ID</th>
                <th scope="col">Pin Code</th>
                <th scope="col">Action</th>
            
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(prof, index) in filteredProfessionals" :key="prof.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ prof.fullname }}</td>
                <td>{{ prof.service_id }}</td>
                <td>{{ prof.pincode }}</td>
                <td>
                  <button v-if="prof.active==false" @click='approve(prof.user_id)'>Approve</button>
                  <button v-else-if="prof.is_blocked==false" @click='block(prof.user_id)'>Block</button>
                  <button v-else="prof.is_blocked==false" @click='unblock(prof.user_id)'>UnBlock</button>
                </td>
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
      async fetchProfessioinals(){
        const res = await fetch(location.origin + '/api/professionals', {
          headers : {
              'Authentication-Token' : this.$store.state.auth_token
          }
      })
      if (res.ok){
        this.professionals = await res.json()
      }
      }
      ,
        async approve(id) {
            // Add logic to block professional
            const res = await fetch(location.origin + '/user_action/' + id, {
              method: 'POST',
              headers : {'Content-Type': 'application/json', 
                  'Authentication-Token' : this.$store.state.auth_token
                    },
              body: 
                    JSON.stringify({'role': 'professional', 'param':'Approve'})
                   },
              )
              if (res.ok){
                this.fetchProfessioinals()
              }
          },
          async unblock(id) {
            // Add logic to block professional
            const res = await fetch(location.origin + '/user_action/' + id, {
              method: 'POST',
              headers : {'Content-Type': 'application/json', 
                  'Authentication-Token' : this.$store.state.auth_token
                    },
              body: 
                    JSON.stringify({'role': 'professional', 'param':'Unblock'})
                   },
              )
              if (res.ok){
                this.fetchProfessioinals()
              }
          },
          async block(id) {
            // Add logic to block professional
            const res = await fetch(location.origin + '/user_action/' + id, {
              method: 'POST',
              headers : {'Content-Type': 'application/json', 
                  'Authentication-Token' : this.$store.state.auth_token
                    },
              body: 
                    JSON.stringify({'role': 'professional', 'param':'Block'})
                   },
              )
              if (res.ok){
                this.fetchProfessioinals()
              }
          },
    },
    async mounted(){
        this.fetchProfessioinals()
    },
    computed: {
      filteredProfessionals() { if (!this.requestQuery) return this.professionals; 
          const lowerQuery = this.requestQuery.toLowerCase();
           return this.professionals.filter(prof => prof.fullname.toLowerCase().includes(lowerQuery) || prof.user_id.toString().includes(lowerQuery) || prof.service_id.toString().includes(lowerQuery) || prof.pincode.toString().includes(lowerQuery)); }
    },


}