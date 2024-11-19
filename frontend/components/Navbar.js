export default {
    template : `
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Welcome </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav" >
                        <ul class="navbar-nav ms-auto" style="display: flex; justify-content: center; width: 100%; padding-right: 15%;" >
                            <li class="nav-item"><router-link to='/'>Home</router-link></li>
                            <!-- <li class="nav-item"><a class="nav-link" href="/search">Search</a></li> -->
                            <li class="nav-item"><a class="nav-link" href="/summary">Summary</a></li>
                            <!-- <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li> -->
                            <li class="nav-item"><a class="nav-link" href="/profile">Profile</a></li>
                        </ul>
                    </div>
                        <router-link to='/register'>Register</router-link>
                        <router-link to='/login'>Login</router-link>
                    <div class="nav-link btn btn-primary" style="display: flex;">
                        <button @click="$store.commit('logout')">Logout</button>
                </div>
            </div>
        </nav>
         
    </div>
    `
}