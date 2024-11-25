const Home = {
    template : `<h1> this is home </h1>`
}
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminDashboardPage from "../pages/AdminDashboardPage.js"
import CustomerDashboardPage from "../pages/CustomerDashboardPage.js";
import ProfessionalDashboardPage from "../pages/ProfessionalDashboardPage.js";
import ServiceProfessionals from "../pages/ServiceProfessionals.js";
import CustomerRegister from "../pages/CustomerRegisterPage.js";
import ProfessionalRegister from "../pages/ProfessionalRegisterPage.js";
import Profile from "../pages/Profile.js";
import Summary from "../pages/Summary.js";
import SearchCustomerPage from "../pages/SearchCustomerPage.js";

const routes = [
    {path : '/', component : Home},
    {path : '/profile', component : Profile},
    {path : '/summary', component : Summary},
    {path : '/search_customer', component : SearchCustomerPage},

    
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/customer_register', component : CustomerRegister},
    {path : '/professional_register', component : ProfessionalRegister},
    {path : '/admin', component : AdminDashboardPage},
    {path : '/customer', component : CustomerDashboardPage},
    {path : '/professional', component : ProfessionalDashboardPage},
    {path : '/service/:service_id/:user_id', component : ServiceProfessionals, props : true},
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