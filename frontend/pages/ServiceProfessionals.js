export default {
    props: ['user_id', 'service_id'],
    template: `
        <div class="container mt-4" v-if="professionals.length != 0" >
            <h1>Best Professionals for Service ID: {{ service_id }}</h1>
            <div style="display: flex">
                <div v-for="prof in professionals" :key="prof.user_id" class="card" style="width: 15rem; padding: 20px; margin: 20px">
                <img src="https://imgs.search.brave.com/0jjDdElNJ3_cbtITXmwh__8IfbLWY2JPa6-w2sEL6tA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by91/c2VyLWZyb250LXNp/ZGUtd2l0aC13aGl0/ZS1iYWNrZ3JvdW5k/XzE4NzI5OS00MDAw/Ny5qcGc_c2VtdD1h/aXNfaHlicmlk" class="card-img-top" alt="...">
                    <h4>{{ prof.fullname }}</h4>
                    <h6 class="card-text">Some quick example text to build.</h6>
                    <button @click="bookService(prof.user_id)" class="btn btn-primary">Book</button>
                </div>
            </div>
            
        </div>
        <div class="container mt-4" v-else >
            <h1>Sorry, No Professional is available in your Location</h1> 
        </div>
    `,
    data() {
        return {
            professionals: []
        };
    },
    methods: {
        async fetchProfessionals() {
            const res = await fetch(`/api/service/${this.service_id}/professionals` , {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            this.professionals = await res.json();
        },

        async bookService(professionalId) {
            const res = await fetch(location.origin+`/service_request/${this.user_id}/${professionalId}`, 
                {
                    headers: {'Content-Type' : 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    }, 
                })
            if (res.ok){
                console.log('we are register')
                this.$router.push('/customer')
            }
        }
    },
    mounted() {
        this.fetchProfessionals();
    }
};
