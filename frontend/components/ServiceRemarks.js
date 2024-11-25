export default {
    template: `
        <div class="modal fade" id="serviceRemarksModal" tabindex="-1" aria-labelledby="serviceRemarksModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="serviceRemarksModalLabel">Service Remarks</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveChanges">
                            <div class="mb-3">
                            <div style="display: flex; justify-content:space-around; padding-bottom: 20px;">
                            <button type="button" class="button-89">Service Name: {{service.service_name}}</button>                
                            <button type="button" class="button-89">Professional: {{service.professional_name}}</button>                                        
                        </div>
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Remarks:</label>
                                <textarea id="description" v-model="formData.remarks" class="form-control" rows="4" placeholder="Enter description"></textarea>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="submit" class="btn btn-primary">Close it?</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['service'],
    data() {
        return {
            formData: {
                remarks: '',
            }
        };
    },

    methods: {
        
        saveChanges() {
            this.$emit('save', this.formData);
            const modalElement = document.getElementById('serviceRemarksModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        },

        
    }
};
