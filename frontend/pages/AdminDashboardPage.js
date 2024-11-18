import AddService from "../components/AddService.js";
import ProfessionalsList from "../components/ProfessionalsList.js";
import ServiceList from "../components/ServiceList.js";

export default {
    template : `
        <div>
            <p>Hello</p>
            <ProfessionalsList></ProfessionalsList>
            <ServiceList></ServiceList>
            <AddService></AddService>
        </div>
    `,

    components  : {
        ProfessionalsList,
        ServiceList,
        AddService,
    },

}