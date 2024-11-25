export default {
    template :`
     <div class="container mt-4">
        <h3>Manage Professionals</h3>
          <!-- search box -->
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
                <th scope="col">Address</th>
                <th scope="col">Pin Code</th>
                <th scope="col">Action</th>
            
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(prof, index) in filteredCustomers" :key="prof.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ prof.fullname }}</td>
                <td>{{ prof.address }}</td>
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
            customers: [],
            requestQuery: ''
        }
    },
    methods : {
      async fetchCustomers(){
        const res = await fetch(location.origin + '/api/customers', {
          headers : {
              'Authentication-Token' : this.$store.state.auth_token
          }
      })
      if (res.ok){
        this.customers = await res.json()
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
                    JSON.stringify({'role': 'customer', 'param':'Approve'})
                   },
              )
              if (res.ok){
                this.fetchCustomers()
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
                    JSON.stringify({'role': 'customer', 'param':'Unblock'})
                   },
              )
              if (res.ok){
                this.fetchCustomers()
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
                    JSON.stringify({'role': 'customer', 'param':'Block'})
                   },
              )
              if (res.ok){
                this.fetchCustomers()
              }
          },
    },
    async mounted(){
        this.fetchCustomers()
    },
    computed: {
      filteredCustomers() { if (!this.requestQuery) return this.customers; 
          const lowerQuery = this.requestQuery.toLowerCase();
           return this.customers.filter(prof => prof.fullname.toLowerCase().includes(lowerQuery) || prof.user_id.toString().includes(lowerQuery) || prof.address.toLowerCase().includes(lowerQuery) || prof.pincode.toString().includes(lowerQuery)); }
    },


}