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
    margin: 50px auto;
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
          <input type="text" id="service-name" v-model="serviceName" name="service_name">
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="description" name="description" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="base-price">Base Price:</label>
          <input type="text" id="base-price" v-model="basePrice" name="base_price">
        </div>
        <div class="button-group">
          <button type="submit" class="button add-button">Add</button>
          <button type="button" class="button cancel-button" @click="cancelForm">Cancel</button>
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
    submitForm() {
      // Submit form logic or call an API endpoint here
      console.log("Form Submitted", {
        serviceName: this.serviceName,
        description: this.description,
        basePrice: this.basePrice
      });
    },
    cancelForm() {
      // Clear form fields or navigate away
      this.serviceName = '';
      this.description = '';
      this.basePrice = '';
    }
  }
};
