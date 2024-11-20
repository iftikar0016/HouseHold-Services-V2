export default {
    template: `
        <div class="modal fade" id="editServiceModal" tabindex="-1" aria-labelledby="editServiceModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editServiceModalLabel">Edit Service</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveChanges">
                            <div class="mb-3">
                                <label for="service-name" class="form-label">Service Name:</label>
                                <input type="text" id="service-name" v-model="formData.service_name" class="form-control" placeholder="Enter service name">
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Description:</label>
                                <textarea id="description" v-model="formData.description" class="form-control" rows="4" placeholder="Enter description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="base-price" class="form-label">Base Price:</label>
                                <input type="text" id="base-price" v-model="formData.base_price" class="form-control" placeholder="Enter base price">
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
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
                service_name: '',
                description: '',
                base_price: ''
            }
        };
    },
    watch: {
        service: {
            immediate: true,
            handler(newService) {
                if (newService) {
                    this.formData.service_name = newService.name || '';
                    this.formData.description = newService.description || '';
                    this.formData.base_price = newService.price || '';
                }
            }
        }
    },
    methods: {
        async updateService(updatedService) {
            // Handle service update logic here
            const res = await fetch(location.origin+'/register', 
              {method : 'POST', 
                  headers: {'Content-Type' : 'application/json',
                            'Authentication-Token': this.$store.state.auth_token
                  }, 
                  body : JSON.stringify(updatedService)
              })
          if (res.ok){
            console.log('Service updated:', updatedService);
          }
          
        },
        saveChanges() {
            this.$emit('save', this.formData);
            const modalElement = document.getElementById('editServiceModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            this.clearForm();
        },
        clearForm() {
            this.formData = {
                service_name: '',
                description: '',
                base_price: ''
            };
        }
    }
};
