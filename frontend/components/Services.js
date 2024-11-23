export default {
    template: `
        <div>
            <!-- Main Section: Looking For? -->
            <section class="container mt-5">
                <form @submit.prevent="searchServices" style="display: flex; justify-content: center;">
                    <div class="input-group mb-3">
                        <input 
                            style="max-width: 20%;" 
                            v-model="searchQuery" 
                            type="text" 
                            class="form-control" 
                            placeholder="Search Service"
                            aria-label="Search Service"
                        />
                        <button class="btn btn-outline-secondary" type="submit">Search</button>
                    </div>
                </form>
                <h2 style="padding-bottom: 5px; display: flex; justify-content: center;">All Available Services</h2>
                <div class="row g-3">
                    <div 
                        v-for="service in filteredServices" 
                        :key="service.id" 
                        class="col-md-3"
                    >
                        <button 
                            @click="viewService(service.id)" 
                            class="btn btn-outline-primary w-100 py-3"
                        >
                            {{ service.name }}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `,

    data() {
        return {
            searchQuery: '',
            services: [], // Array for "Looking For?" section
        };
    },

    methods: {
        async searchServices() {
            // API call for searching services
            const res = await fetch(`/search_service/${this.$store.state.user_id}?result=${this.searchQuery}`);
            if (res.ok) {
                this.services = await res.json();
            }
        },

        async viewService(serviceId) {
            // Navigate to service details
            this.$router.push(`/service/${serviceId}/${this.$store.state.user_id}`);
        },


        async fetchServices() {
            const res = await fetch(location.origin + '/api/services', {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
    
            this.services = await res.json();
        },

    },
    computed: {
        filteredServices() {
          // Filter services based on search query
          if (!this.searchQuery) return this.services;
          return this.services.filter(service =>
            service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        },
      },

    async mounted() {
        // Fetch initial data for services and service history
        await this.fetchServices();
    },
    
};
