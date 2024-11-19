import AddService from "../components/AddService.js";
import ProfessionalsList from "../components/ProfessionalsList.js";
import ServiceList from "../components/ServiceList.js";

export default {
    template : `

                      <!-- Admin Tabs Section -->
<div class="container mt-5">
    <!-- <h2>Manage Services, Professionals, Service Requests</h2> -->
        <ul class="nav nav-tabs" id="adminTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="services-tab" data-bs-toggle="tab" data-bs-target="#services" type="button" role="tab" aria-controls="services" aria-selected="true">Services</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="professionals-tab" data-bs-toggle="tab" data-bs-target="#professionals" type="button" role="tab" aria-controls="professionals" aria-selected="false">Professionals</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="service-requests-tab" data-bs-toggle="tab" data-bs-target="#service-requests" type="button" role="tab" aria-controls="service-requests" aria-selected="false">Service Requests</button>
            </li>
        </ul>

    <!-- Tab Content -->
    <div class="tab-content mt-3" id="adminTabContent">
        <!-- Services Tab -->
        <div class="tab-pane fade show active" id="services" role="tabpanel" aria-labelledby="services-tab">
            <h3 style="display: flex; justify-content: center; padding-bottom: 5px;">Manage Services</h3>
            <!-- Add table or functionality to manage services here -->
            
                <button class="button-50" role="button" @click="AddServiceAction" >Add Service</button>
                <AddService v-if="showAddService"
                    @AddServiceAction="AddServiceAction"
                ></AddService>

            <!-- all the services are here -->
            <ServiceList></ServiceList>
                
        </div>


        <!-- Professionals Tab -->
        <div class="tab-pane fade" id="professionals" role="tabpanel" aria-labelledby="professionals-tab">
            <h3>Manage Professionals</h3>
            <!-- search box -->
              <form action="/search_professional">
                <div class="input-group mb-3" style="padding-left: 300px; padding-right: 200px; padding-top: 30px;">
                    <input name="result" type="text" class="form-control" placeholder="Search Professional" aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Search</button>
                </div>
              </form>

            <!-- Add table or functionality to manage professionals here -->
            <ProfessionalsList></ProfessionalsList>

        </div>


        <!-- Service Requests Tab -->
        <div class="tab-pane fade" id="service-requests" role="tabpanel" aria-labelledby="service-requests-tab">
            <h3>Manage Service Requests</h3>
            <!-- Add table or functionality to manage service requests here -->

        </div>
    </div>
</div>
    `,
    data(){
        return{
            showAddService: false,
        }
    },
    methods: {
        AddServiceAction(){
            this.showAddService=!this.showAddService
        }
    },
    components : {
        ProfessionalsList,
        ServiceList,
        AddService,
    },

}