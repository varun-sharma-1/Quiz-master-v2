const SearchResults = {
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
            <h2>Search Results</h2>

            <!-- Users -->
            <h3>Users</h3>
            <ul v-if="users.length">
                <li v-for="user in users" :key="user.id">
                    {{ user.email }} (ID: {{ user.id }})
                </li>
            </ul>
            <p v-else>No users found.</p>

            <!-- Subjects -->
            <h3>Subjects</h3>
            <ul v-if="subjects.length">
                <li v-for="subject in subjects" :key="subject.id">
                    {{ subject.subjectname }}
                </li>
            </ul>
            <p v-else>No subjects found.</p>

            <!-- Quizzes -->
            <h3>Quizzes</h3>
            <ul v-if="quizzes.length">
                <li v-for="quiz in quizzes" :key="quiz.id">
                    Quiz ID: {{ quiz.id }}, Date: {{ quiz.date_of_quiz }}
                </li>
            </ul>
            <p v-else>No quizzes found.</p>

            <!-- Questions -->
            <h3>Questions</h3>
            <ul v-if="questions.length">
                <li v-for="question in questions" :key="question.id">
                    {{ question.title }} - {{ question.question_statement }}
                </li>
            </ul>
            <p v-else>No questions found.</p>
        </main>
    </div>
    `,

    data() {
        return {
            query: "",
            users: [],
            subjects: [],
            quizzes: [],
            questions: []
        };
    },

    methods: {
        async fetchSearchResults() {
            try {
                const token = localStorage.getItem('auth-token');
                this.query = this.$route.query.query || "";  

                if (!this.query.trim()) {
                    console.warn("🔍 No search query provided.");
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
        this.fetchSearchResults();
    }
};

// Register component in Vue Router
export default SearchResults;
