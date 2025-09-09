const UserSummary = {
    template: `
    <div>
        <header>
            <nav class="id47">
                <h3 class="id48">Welcome User</h3>
                <router-link to="/user-dashboard" class="id48">Home</router-link>
                <router-link to="/view-scores" class="id48">Score</router-link>
                <router-link to="/user-summary" class="id48">Summary</router-link>
                <a href="#" @click.prevent="logout" class="id48">Logout</a>
                <form @submit.prevent="performSearch" class="id48">
                    <input type="text" v-model="query" placeholder="subjects or quizzes" required>
                    <button type="submit">Search</button>
                </form>
            </nav>
        </header>
        <h2>Quiz Performance</h2>
        <canvas id="barChart"></canvas>
        <canvas id="pieChart"></canvas>
    </div>
    `,
    data() {
        return {
            subjectQuizCounts: {},
            monthCounts: {},
            query: ''
        };
    },
    methods: {
        async fetchSummary() {
            try {
                const response = await fetch("/api/user_summary", {
                    headers: {
                        'Token': localStorage.getItem("auth-token")
                    }
                });
                const data = await response.json();

                if (data) {
                    this.subjectQuizCounts = data.subject_quiz_counts;
                    this.monthCounts = data.month_counts;
                    this.renderCharts();
                }
            } catch (error) {
                console.error("Error fetching user summary:", error);
            }
        },
        renderCharts() {
            
            new Chart(document.getElementById("barChart"), {
                type: "bar",
                data: {
                    labels: Object.keys(this.subjectQuizCounts),
                    datasets: [{
                        label: "Number of Quizzes",
                        data: Object.values(this.subjectQuizCounts),
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    }]
                }
            });

            
            new Chart(document.getElementById("pieChart"), {
                type: "pie",
                data: {
                    labels: Object.keys(this.monthCounts),
                    datasets: [{
                        label: "Quizzes Attempted",
                        data: Object.values(this.monthCounts),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)"
                        ]
                    }]
                }
            });
        },
        async performSearch() {
            if (!this.query.trim()) {
                alert("Please enter a search term!");
                return;
            }

            try {
                const response = await fetch(`/api/search_user?query=${this.query}`, {
                    headers: {
                        'Token': localStorage.getItem("auth-token")
                    }
                });
                const data = await response.json();

                if (data.status === "success") {
                    this.subjects = data.subjects;
                    this.quizzes = data.quizzes;
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
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
        }
    },
    mounted() {
        this.fetchSummary();
    }
};

export default UserSummary;
