const EditQuiz = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="updateQuiz" class="login12">
                <h3>Edit Quiz</h3>
                
                <label class="mincontainer">Subject:</label>
                <input class="maxcontainer" type="text" :value="subjectname" readonly><br><br>
                
                <label class="mincontainer">Chapter:</label>
                <input class="maxcontainer" type="text" :value="chaptername" readonly><br><br>
                
                <label for="quizdate" class="mincontainer">Quiz Date:</label>
                <input v-model="quizdate" type="date" id="quizdate" class="maxcontainer" required><br><br>
                
                <label for="quiztime" class="mincontainer">Quiz Duration (minutes):</label>
                <input v-model="quiztime" type="number" id="quiztime" class="maxcontainer" min="1" required><br><br>
                
                <button type="submit" class="maxocontainer">Update Quiz</button>
                <br><br>
                <router-link to="/quiz-management" class="id50">Cancel</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            subjectname: '',
            chaptername: '',
            quizdate: '',
            quiztime: ''
        };
    },
    methods: {
        async fetchQuizDetails() {
            try {
                const token = localStorage.getItem('auth-token');
                const quizId = this.$route.params.id;
                const response = await fetch(`/api/quiz/get/${quizId}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
        
                const data = await response.json();
                console.log("Fetched Quiz Data:", data); 
        
                if (response.ok && data) {
                    
                    const quiz = Array.isArray(data) ? data[0] : data;
                    
                    
                    this.quizdate = quiz.date_of_quiz;  
                    this.quiztime = quiz.time_duration;
                    this.subjectname = quiz.subjectname; 
                    this.chaptername = quiz.chaptername;
                } else {
                    alert('Quiz not found');
                    this.$router.push('/quiz-management');
                }
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            }
        },
        async updateQuiz() {
            try {
                const token = localStorage.getItem('auth-token');
                const quizId = this.$route.params.id;
                const response = await fetch(`/api/quiz/update/${quizId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': localStorage.getItem("auth-token")
                    },
                    body: JSON.stringify({
                        date_of_quiz: this.quizdate,
                        time_duration: this.quiztime
                    })
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    this.$router.push('/quiz-management');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error updating quiz:', error);
            }
        }
    },
    mounted() {
        this.fetchQuizDetails();
    }
};

export default EditQuiz;