const QuizManagement = {
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
            <div class="quiz-container">
                <div v-for="subject in quizData" :key="subject.subject_id">
                    <div v-for="chapter in subject.chapters" :key="chapter.chapter_id">
                        <div v-for="quiz in chapter.quizzes" :key="quiz.quiz_id" class="quiz-card">
                            <h3>{{ subject.subject_name }} - {{ chapter.chapter_name }}</h3>
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>Quiz Date</th>
                                        <th>Duration (minutes)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ quiz.date_of_quiz }}</td>
                                        <td>{{ quiz.time_duration }}</td>
                                        <td>
                                            <router-link :to="'/edit-quiz/' + quiz.quiz_id" class="btn edit-btn">Edit</router-link>
                                            <button @click="deleteQuiz(quiz.quiz_id)" class="btn delete-btn">Delete</button>
                                            <router-link :to="'/add-question/' + quiz.quiz_id" class="btn add-btn">Add Questions</router-link>
                                        </td>
                                    </tr>
                                    <tr v-if="chapter.questions.length">
                                        <td colspan="3">
                                            <table class="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Question ID</th>
                                                        <th>Question Title</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="question in chapter.questions.filter(q => q.quiz_id === quiz.quiz_id)" :key="question.question_id">
                                                        <td>{{ question.question_id }}</td>
                                                        <td>{{ question.question_text }}</td>
                                                        <td>
                                                            <router-link :to="'/edit-question/' + question.question_id" class="btn edit-btn">Edit</router-link>
                                                            <button @click="deleteQuestion(question.question_id)" class="btn delete-btn">Delete</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="3" style="text-align: center;">No questions added yet.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <router-link to="/add-quiz" class="id90">New Quiz</router-link>
        </footer>
    </div>
    `,
    data() {
        return {
            quizData: [],
            query: ''
        };
    },
    methods: {
        async fetchQuizData() {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch('/api/quiz_management', {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    this.quizData = data.quiz_management_data;
                } else {
                    alert('Failed to fetch quiz data');
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        },
        async deleteQuiz(quizId) {
            if (!confirm('Are you sure you want to delete this quiz?')) return;
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/quiz/delete/${quizId}`, {
                    method: 'DELETE',
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                alert(data.message);
                this.fetchQuizData();
            } catch (error) {
                console.error('Error deleting quiz:', error);
            }
        },
        async deleteQuestion(questionId) {
            if (!confirm('Are you sure you want to delete this question?')) return;
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/question/delete/${questionId}`, {
                    method: 'DELETE',
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                alert(data.message);
                this.fetchQuizData();
            } catch (error) {
                console.error('Error deleting question:', error);
            }
        },
        async fetchQuestions() {
            try {
                const token = localStorage.getItem('auth-token');
                const quizId = this.$route.params.id;
                const response = await fetch(`/api/question/get/${quizId}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
        
                const data = await response.json();
                console.log("Fetched Questions:", data);  
        
                if (response.ok && data.length > 0) {
                    this.questions = data.map(q => ({
                        id: q.id,
                        title: q.question_title,  
                        statement: q.question_statement,  
                        option1: q.option1,
                        option2: q.option2,
                        option3: q.option3,
                        option4: q.option4,
                        correctOption: q.correct_option
                    }));
                } else {
                    alert('No questions found');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        },        
        search() {
            this.$router.push(`/search?query=${this.query}`);
            this.fetchSearchResults();
        },
        async fetchSearchResults() {
            try {
                const token = localStorage.getItem('auth-token');
                const searchQuery = this.$route.query.query;

                const response = await fetch(`/api/search?query=${searchQuery}`, {
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
        async logout() {
            try {
                const token = localStorage.getItem("auth-token");
    
                const response = await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                        'Token': localStorage.getItem("auth-token"),
                        "Content-Type": "application/json"
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
        this.fetchQuizData();
    }
};

export default QuizManagement;
