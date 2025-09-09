const AdminSummary = {
    template: `
    <div>
        <header>
            <nav class="id47">
                <h3 class="id48">Welcome Admin</h3>
                <router-link to="/admin-dashboard" class="id48">Home</router-link>
                <router-link to="/quiz-management" class="id48">Quiz</router-link>
                <router-link to="/admin-summary" class="id48">Summary</router-link>
                <a href="#" @click.prevent="logout" class="id48">Logout</a>
                <form @submit.prevent="search" class="id48">
                    <input type="text" v-model="query" placeholder="user, subject, or quiz" required>
                    <button type="submit">Search</button>
                </form>
            </nav>
        </header>
        <main>    
        <h2>Quiz Performance</h2>
        <canvas ref="barChart"></canvas>
        <canvas ref="pieChart"></canvas>
        </main>
    </div>
    `,
    data() {
        return {
            subjects: [],
            topScores: [],
            attempts: [],
            query: ''
        };
    },
    methods: {
        async fetchSummary() {
            try {
                console.log("🔍 Fetching summary...");
        
                const response = await fetch('/api/admin_summary', {
                    headers: {
                        'Token': localStorage.getItem("auth-token")
                    }
                });
        
                console.log(" HTTP Status:", response.status);
                const text = await response.text();  
                console.log(" Raw Response:", text);  
        
                
                if (!response.headers.get("content-type")?.includes("application/json")) {
                    console.error(" Response is not JSON. Possible HTML error page.");
                    alert("Error: Server returned an unexpected response. Check console for details.");
                    return;
                }
        
                const data = JSON.parse(text);  
        
                if (!data.top_scores || !data.subject_attempts) {
                    console.error("Invalid API response:", data);
                    return;
                }
        
                this.subjects = Object.keys(data.top_scores || {});
                this.topScores = Object.values(data.top_scores || {});
                this.attempts = Object.values(data.subject_attempts || {});
        
                
                this.$nextTick(() => {
                    this.renderCharts();
                });
        
            } catch (error) {
                console.error(" Error fetching summary:", error);
            }
        },
        renderCharts() {
            if (!this.$refs.barChart || !this.$refs.pieChart) {
                console.error("Chart elements not found.");
                return;
            }
        
            const barCtx = this.$refs.barChart.getContext('2d');
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: this.subjects,
                    datasets: [{
                        label: 'Highest Quiz Score',
                        data: this.topScores,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                }
            });
        
            const pieCtx = this.$refs.pieChart.getContext('2d');
            new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: this.subjects,
                    datasets: [{
                        label: 'Quiz Attempts',
                        data: this.attempts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)'
                        ]
                    }]
                }
            });
        },
        async logout() {
            try {
                const token = localStorage.getItem("auth-token");
        
                const response = await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                        'Token': localStorage.getItem("auth-token")
                    }
                });
        
                if (response.ok) {
                    const data = await response.json();  
                    alert(data.message);  
                    localStorage.removeItem("auth-token");
                    this.$router.push("/");  
                } else {
                    alert("Logout failed. Please try again.");
                }
            } catch (error) {
                console.error("Logout error:", error);
            }
        },

        async fetchSearchResults() {
            try {
                const token = localStorage.getItem('auth-token');
                this.query = this.$route.query.query || "";  

                if (!this.query.trim()) {
                    console.warn(" No search query provided.");
                    return;
                }

                console.log("🔍 Fetching search results for:", this.query);

                const response = await fetch(`/api/search?query=${encodeURIComponent(this.query)}`, {
                    headers: {
                        'Token': localStorage.getItem("auth-token")  
                    }
                });

                const data = await response.json();
                console.log(" API Response:", data);

                if (response.ok) {
                    this.users = data.users;
                    this.subjects = data.subjects;
                    this.quizzes = data.quizzes;
                    this.questions = data.questions;
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(" Error fetching search results:", error);
            }
        },

        search() {
            if (!this.query.trim()) {
                alert("Please enter a search query.");
                return;
            }
            this.$router.push(`/search?query=${encodeURIComponent(this.query)}`);
            this.fetchSearchResults();
        }
    },
    mounted() {
        this.fetchSummary();
    }
};

export default AdminSummary;
