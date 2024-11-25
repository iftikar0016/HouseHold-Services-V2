

export default {
  template: `
  <div class="loginpage">
  <div class="login-container">
  <form @submit.prevent="submitForm">
    <!-- <span>Have an account?</span> -->
    <header>Your Profile</header>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="text" class="form-control" id="email" v-model="email" :placeholder="response.email">
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="text" class="form-control" id="password" v-model="password" placeholder="*****">
    </div>

    <div class="mb-3">
      <label for="pincode" class="form-label">Pincode</label>
      <input type="text" class="form-control" id="pincode" v-model="pincode" :placeholder="response.pincode">
    </div>
    <div class="mb-3">
      <label for="pincode" class="form-label">Full Name</label>
      <input type="text" class="form-control" id="fullname" v-model="fullname" :placeholder="response.fullname">
    </div>
    <div class="mb-3">
      <label for="address" class="form-label">Address</label>
      <input type="text" class="form-control" id="address" v-model="address" :placeholder="response.address">
    </div>
    <button type="submit" class="btn">Save Changes</button>
  </form>
</div>
</div>
  `,
  data() {
    return {
      email: '',
      password: '',
      address: '',
      fullname:'',
      pincode:'',
  

      response:{},
    };
  },
  methods: {
   async submitForm() {
      const res = await fetch(location.origin+'/profile/' + this.$store.state.user_id , 
        {method : 'POST', 
            headers: {'Content-Type' : 'application/json',
                      'Authentication-Token' : this.$store.state.auth_token
            }, 
            body : JSON.stringify({'email': this.email,'password': this.password, 'pincode' : this.pincode, 'fullname': this.fullname, 'address': this.address })
        })
        if (res.ok){
          if(this.$store.state.role=="professional"){
            this.$router.push('/professional')
          }
          else{
            this.$router.push('/customer')
          }
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`); 
         } 
      },
      async fetchData(){
        try{
        const res = await fetch(location.origin+'/profile/' + this.$store.state.user_id, {
          headers: {
              'Authentication-Token': this.$store.state.auth_token
          }
        });
        if (!res.ok) {
         throw new Error(`HTTP error! status: ${res.status}`); 
        } 
         this.response = await res.json(); 
        } 
         catch (error) { 
          console.error('Error fetching data:', error);
      }}
   
  }
  ,
  mounted(){
    this.fetchData();
  }
};
