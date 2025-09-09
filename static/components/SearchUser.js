const SearchUser = {
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
            <!-- Subjects -->
            <h2>Subjects</h2>
            <ul v-if="subjects.length">
                <li v-for="subject in subjects" :key="subject.id">
                    {{ subject.subjectname }}
                </li>
            </ul>
            <p v-else>No subjects found.</p>

            <!-- Quizzes -->
            <h2>Quizzes</h2>
            <ul v-if="quizzes.length">
                <li v-for="quiz in quizzes" :key="quiz.quiz_id">
                    Quiz ID: {{ quiz.quiz_id }}, Subject: {{ quiz.subject_name }},
                    Chapter: {{ quiz.chapter_name }}, Date: {{ quiz.date_of_quiz }}
                </li>
            </ul>
            <p v-else>No quizzes found.</p>
        </main>
    </div>
    `,
    data() {
        return {
            query: "",
            subjects: [],
            quizzes: []
        };
    },
    methods: {
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
    }
};

export default SearchUser;
