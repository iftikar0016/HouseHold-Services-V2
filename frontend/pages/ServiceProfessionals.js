export default {
    props: ['user_id', 'service_id'],
    template: `
        <div>
            <h1>Best Professionals for Service ID: {{ service_id }}</h1>
            <div v-for="prof in professionals" :key="prof.user_id" class="card" style="width: 15rem;">
                <h4>{{ prof.fullname }}</h4>
                <button @click="bookService(prof.user_id)">Book</button>
            </div>
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
