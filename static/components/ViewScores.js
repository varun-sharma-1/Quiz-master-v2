const ViewScores = {
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
        <div class="subject-container">
        <h2>Quiz Scores</h2>
        <button @click = "csvExport" class="btn add-btn">Download CSV</button>
        <button @click = "csvImport" class="btn edit-btn">Download Monthly CSV</button>

        <table v-if="scores.length" class="styled-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Chapter</th>
                    <th>Quiz Date</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="score in scores" :key="score.quiz_id">
                    <td>{{ score.subject }}</td>
                    <td>{{ score.chapter }}</td>
                    <td>{{ score.date_of_quiz }}</td>
                    <td>{{ score.marks }}</td>
                </tr>
            </tbody>
        </table>
        
        <p v-else>No scores available yet. Take a quiz first!</p>
        </div>
    </div>
    `,

    data() {
        return {
            scores: [],
            query: ''
        };
    },

    methods: {
        async fetchScores() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch("/api/view_scores", {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });

                const data = await response.json();
                if (data.status === "success") {
                    this.scores = data.scores.map(score => ({
                        ...score,
                        date_of_quiz: score.date_of_quiz
                    }));
                } else {
                    alert("Error fetching scores");
                }
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
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
        },
        async csvExport() {
            const token = localStorage.getItem("auth-token");
        
            try {
                const response = await fetch('/api/export', {
                    method: "GET",
                    headers: { 'Token': token }
                });
        
                const data = await response.json();
                if (!data.task_id) {
                    throw new Error("No task ID received.");
                }
        
                console.log("Task ID:", data.task_id);
                await this.checkTaskStatus(data.task_id);
        
            } catch (error) {
                console.error("Error exporting CSV:", error);
            }
        },
        
        async checkTaskStatus(taskId) {
            try {
                while (true) {
                    const response = await fetch(`/api/csv_result/${taskId}`);
        
                    
                    if (response.headers.get("content-type")?.includes("text/csv")) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "quiz_report.csv";  
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        return;  
                    }
        
                    const result = await response.json();  
                    if (result.ready) {
                        if (!result.successful) {
                            alert("CSV Export failed: " + result.error);
                        }
                        break;
                    }
        
                    await new Promise(resolve => setTimeout(resolve, 2000));  
                }
            } catch (error) {
                console.error("Task check error:", error);
            }
        },
        async csvImport() {
            const token = localStorage.getItem("auth-token");
        
            try {
                const response = await fetch('/api/import', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': token
                    },
                    body: JSON.stringify({})
                });
        
                const data = await response.json();
                if (data.task_id) {
                    alert("Report generation started! You will receive an email when it's ready.");
                } else {
                    alert("Failed to start report generation.");
                }
            } catch (error) {
                console.error("Error exporting CSV:", error);
            }
        }                        
    },

    mounted() {
        this.fetchScores();
    }
};

export default ViewScores;
