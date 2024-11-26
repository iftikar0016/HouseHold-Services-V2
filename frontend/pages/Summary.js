export default {
template:` 
 <div class="chart-container" style="margin-top:30px">
    <h1>Service Requests Overview</h1>
    <canvas id="serviceChart" width="900" height="400"></canvas>
  </div>
  `
,

  props: ['id'],
  data() {
    return {
      labels: [],
      values: []
    };
  },
  async mounted() {
    // Fetch the data from the backend
    if (this.$store.state.role=="admin"){
      const res = await fetch(`${location.origin}/summary`, {
        headers: {
          'Authentication-Token': this.$store.state.auth_token
        }
      });
      if (res.ok) {
        const data = await res.json();
        this.labels = data.labels;
        this.values = data.values;
        this.renderChart();
    }
    }else{
      const res = await fetch(`${location.origin}/summary/${this.$store.state.user_id}`, {
        headers: {
          'Authentication-Token': this.$store.state.auth_token
        }
      });
      if (res.ok) {
        const data = await res.json();
        this.labels = data.labels;
        this.values = data.values;
        this.renderChart();
      }
    }
  }
  ,
  methods: {
    renderChart() {
      const ctx = document.getElementById('serviceChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut', // .......... 'line', 'pie', doughnut, bar, polarArea, radar
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Service Requests',
            data: this.values,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
};


