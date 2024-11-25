export default {
    template : `
    <div v-if="$store.state.loggedIn">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#" v-if="$store.state.role !=='admin'">User Dashboard </a>
                <a class="navbar-brand" href="#" v-if="$store.state.role=='admin'">Admin Dashboard </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav" >
                        <ul class="navbar-nav ms-auto" style="display: flex; justify-content: center; width: 100%; padding-right: 15%;" >
                           
                                <router-link to='/admin' class="nav-link" v-if="$store.state.role=='admin'" ><li class="nav-item">Home</li></router-link>
                                <router-link to='/search_customer' class="nav-link" v-if="$store.state.role=='admin'" ><li class="nav-item">SearchCustomer</li></router-link>
                                <router-link to='/customer' class="nav-link" v-if="$store.state.role=='customer'" > <li class="nav-item">Home</li></router-link>
                                <router-link to='/professional' class="nav-link" v-if="$store.state.role=='professional'" ><li class="nav-item">Home</li></router-link>
                           
                            <!-- <li class="nav-item"><a class="nav-link" href="/search">Search</a></li> -->
                            <router-link to='/summary' class="nav-link" ><li class="nav-item">Summary</li></router-link>

                            <!-- <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li> -->
                            <router-link to='/profile' class="nav-link" v-if="$store.state.role!=='admin'" ><li class="nav-item">Profile</li></router-link>
                        </ul>
                    </div>
   
                    <div class="nav-link btn btn-primary" style="display: flex;">
                        <button class="button-4" @click="logout">Logout</button>
                </div>
            </div>
        </nav>
         
    </div>
    `
    ,

    methods:{ 
        logout(){
        this.$store.commit('logout');
        this.$router.push('/login');
    }
}
}