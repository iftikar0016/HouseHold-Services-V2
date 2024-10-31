export default {
    template : `
    <div>
        <router-link to='/'>Home</router-link>
        <router-link to='/login'>Login</router-link>
        <router-link to='/register'>Register</router-link>
        <button @click="$store.commit('logout')">Logout</button>
    </div>
    `
}