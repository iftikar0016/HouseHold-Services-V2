const Home = {
    template : `<h1> this is home </h1>`
}
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminDashboardPage from "../pages/AdminDashboardPage.js"
import CustomerDashboardPage from "../pages/CustomerDashboardPage.js";
import ProfessionalDashboardPage from "../pages/ProfessionalDashboardPage.js";

const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/admin', component : AdminDashboardPage},
    {path : '/customer', component : CustomerDashboardPage},
    {path : '/professional', component : ProfessionalDashboardPage},
]

const router = new VueRouter({
    routes
})

// navigation guards
// router.beforeEach((to, from, next) => {
//     if (to.matched.some((record) => record.meta.requiresLogin)){
//         if (!store.state.loggedIn){
//             next({path : '/login'})
//         } else if (to.meta.role && to.meta.role != store.state.role){
//             alert('role not authorized')
//              next({path : '/'})
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// })


export default router;