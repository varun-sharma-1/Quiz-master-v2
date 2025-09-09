const UserDashboard = {
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

        <main>
            <div class="subject-container">
                <h2>Upcoming Quizzes</h2>
                <table v-if="quizzes.length" class="styled-table">
                    <thead>
                        <tr>
                            <th>Chapter Name</th>
                            <th>Quiz Date</th>
                            <th>Duration (minutes)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="quiz in quizzes" :key="quiz.quiz_id">
                            <td>{{ quiz.chapter_name }}</td>
                            <td>{{ quiz.date_of_quiz }}</td>
                            <td>{{ quiz.time_duration }}</td>
                            <td>
                                <router-link :to="'/view-quiz/' + quiz.quiz_id" class="btn edit-btn">View Quiz</router-link>
                                <router-link :to="'/take-quiz/' + quiz.quiz_id" class="btn add-btn">Take Quiz</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else>No available quizzes.</p>
            </div>
        </main>
    </div>
    `,

    data() {
        return {
            quizzes: [],
            query: ''
        };
    },

    methods: {
        async fetchQuizzes() {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch('/api/user_dashboard', {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                if (data.status === "success") {
                    this.quizzes = data.available_quizzes;
                } else {
                    console.error("Error fetching quizzes:", data);
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
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
        }
    },

    mounted() {
        this.fetchQuizzes();
    }
};

export default UserDashboard;