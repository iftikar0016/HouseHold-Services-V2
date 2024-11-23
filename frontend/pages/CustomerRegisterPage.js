export default {
    template : `
    <div class="customer_register_page">
        <div id="main">
        <div id="formhead">
          <h1>Customer Signup</h1>
        </div>
        <div id="canvas">
          <div id="form-body">
            <form @submit.prevent="register">
              <!-- Email ID  -->
              <label for="email">Email ID:</label>
              <input type="email" id="email" v-model="formData.email" required>
    
              <!-- Password -->
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="formData.password" required>
              
              <!-- Full Name -->
              <label for="fullname">Full Name:</label>
              <input type="text" id="fullname" v-model="formData.fullname" required>
    
              <!-- Address -->
              <label for="address">Address:</label>
              <textarea id="address" v-model="formData.address" rows="4" required></textarea>
    
              <!-- Pin Code -->
              <label for="pincode">Pin Code:</label>
              <input type="text" id="pincode" v-model="formData.pincode">
    
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>    
    </div>
    `,
    data(){
        return {
            formData: {
                email: '',
                password: '',
                fullname: '',
                address: '',
                pincode: '',
                role: 'customer'
              }
        
        } 
    },
    methods : {
        async register() {
            try {
              const response = await fetch(location.origin+'/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
              });
              if (response.ok) {
                // Handle success (e.g., redirect or show success message)
                console.log('Registration successful');
                this.$router.push('/login')
              } else {
                // Handle errors
                console.error('Registration failed');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          },
      
        async submitLogin(){
            const res = await fetch(location.origin+'/register', 
                {method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password, 'role' : this.role})
                })
            if (res.ok){
                console.log('we are register')
                this.$router.push('/login')
            }
        }
    }
}