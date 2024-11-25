// Import CSS styles if necessary, or define them directly in JavaScript as shown below

// Define CSS styles as a string
const styles = `
  * {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }
  
  .form-container {
    width: 400px;
    padding: 20px;
    margin: 10px auto;
    border: 2px solid #ccc;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #000000;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .button {
    width: 48%;
    padding: 10px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .add-button {
    background-color: #2980b9;
  }
  
  .cancel-button {
    background-color: #bdc3c7;
  }
`;

// Add styles to the document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div class="form-container">
      <h2>New Service</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="service-name">Service Name:</label>
          <input type="text" id="service-name" v-model="serviceName" name="service_name" required>
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="description" name="description" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="base-price">Base Price:</label>
          <input type="text" id="base-price" v-model="basePrice" name="base_price" required>
        </div>
        <div class="button-group">
          <button type="submit" class="button-29" style="    width: 48%;
            padding: 10px;
            color: white;
            border: none;
            
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;">
            Add</button>
          <button type="button" class="button-30" style='    width: 48%;
            padding: 10px;
          
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;'
          @click="cancelForm">Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  data() {
    return {
      serviceName: '',
      description: '',
      basePrice: ''
    };
  },
  methods: {
   async submitForm() {
      // Submit form logic or call an API endpoint here
      const res = await fetch(location.origin+'/api/services', 
        {method : 'POST', 
            headers: {'Content-Type' : 'application/json',
                      'Authentication-Token' : this.$store.state.auth_token
            }, 
            body : JSON.stringify({'service_name': this.serviceName,'description': this.description, 'base_price' : this.basePrice})
        })
      if (res.ok){
        console.log("Form Submitted", {
          serviceName: this.serviceName,
          description: this.description,
          basePrice: this.basePrice
        });
      }
      this.$emit('AddServiceAction')
      this.$emit('updated')
      
    },
    cancelForm() {
      // Clear form fields or navigate away
      this.serviceName = '';
      this.description = '';
      this.basePrice = '';
      this.$emit('AddServiceAction');
    }
  }
};
