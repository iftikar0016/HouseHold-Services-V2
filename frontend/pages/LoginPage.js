export default {
    template : `
        <div>
            <input placeholder="email"  v-model="email"/>  
            <input placeholder="password"  v-model="password"/>  
            <button class='btn btn-primary' @click="submitLogin"> Login </button>
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
                })
                if (res.ok){
                    console.log('we are logged in')
                    const data = await res.json()
                  
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
            }
        }
    }