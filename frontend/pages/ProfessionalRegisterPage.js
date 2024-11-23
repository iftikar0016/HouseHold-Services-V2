export default {
    template : `
    <div class="professional_register_page">
        <div id="main">
        <h1>Service Professional Signup</h1>
        <div id="canvas">
        <div id="form-body">
            <form @submit.prevent="register">
            <!-- Email ID (Username) -->
            <label for="email">Email ID:</label>
            <input type="email" id="email" v-model="formData.email" required>

            <!-- Password -->
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="formData.password" required>

            <!-- Full Name -->
            <label for="fullname">Full Name:</label>
            <input type="text" id="fullname" v-model="formData.fullname" required>

            <!-- Service Name (Dropdown) -->
            <label for="service">Service Name:</label>
            <select id="service" v-model="formData.service" required>
                <option value="" disabled selected>Select Service</option>
                <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
            </select>

            <!-- Experience (in yrs) -->
            <label for="experience">Experience (in years):</label>
            <input type="number" id="experience" v-model="formData.experience" min="0" required>

            <!-- Attach Documents (Single PDF) -->
            <label for="documents">Attach Documents (Single PDF):</label>
            <input type="file" id="documents" @change="handleFileUpload" accept="application/pdf" >

            <!-- Address -->
            <label for="address">Address:</label>
            <textarea id="address" v-model="formData.address" rows="4" required></textarea>

            <!-- Pin Code -->
            <label for="pincode">Pin Code:</label>
            <input type="text" id="pincode" v-model="formData.pincode" required>

            <!-- Phone Number -->
            <label for="phone">Phone Number:</label>
            <input type="text" id="phone" v-model="formData.phone" required>

            <!-- Submit Button -->
            <button type="submit">Register</button>
            </form>
        </div>
        </div>
    </div>
    </div>
    `,
        data() {
          return {
            formData: {
              email: '',
              password: '',
              fullname: '',
              service: '',
              experience: '',
              documents: null,
              address: '',
              pincode: '',
              phone: '',
              role:'professional'
            },
            services: [
            ]
          };
        },
        methods: {
          handleFileUpload(event) {
            this.formData.documents = event.target.files[0];
          },

          async fetchServices() {
            const res = await fetch(location.origin + '/api/services', {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            this.services = await res.json();
        },

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
                console.log('Registration successful');
                this.$router.push('/login')
              } else {
                console.error('Registration failed');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }
        },
        async mounted() {
            await this.fetchServices();
        }
      };
      