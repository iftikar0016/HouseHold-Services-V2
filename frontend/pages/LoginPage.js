export default {
    template : `
    <div class="loginpage">
        <div class="login-container">
            <form @submit.prevent="submitLogin">
                <header>Login</header>
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
            <div class="footer">
                <span>Don't have an account?
                    <router-link to='/customer_register' style="padding-left: 12px;">Sign Up</router-link>
                </span>
                <span>Or</span>
                <router-link to='/professional_register'>Register As Professional</router-link>
            </div>
        </div>    
    </div>

`,
    
    data(){
        return {
            email : null,
            password : null,
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/login', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password})
                }).then(async (res)=> {
                    const data = await res.json()
                    if (res.ok){
                        console.log('we are logged in')
                      
                        localStorage.setItem('user', JSON.stringify(data))
                        
                        this.$store.commit('setUser')
                        
                        if (data.role =='admin'){
                            this.$router.push('/admin')
                        }
                        else if (data.role =='customer'){
                            this.$router.push('/customer')
                        }
                        else if (data.role =='professional'){
                            this.$router.push('/professional')
                        }
                            
                    }
                    else{
                        this.error = data.message
                        alert(this.error)
                    }    
        })
                
            
            }
        }
    }
