const EditQuestion = {
    template: `
    <div class="mainoncontainer">
        <div class="container">
            <form @submit.prevent="updateQuestion" class="login12">
                <h2>Edit Question</h2>
                
                <label for="questiontitle" class="mincontainer">Question Title:</label>
                <input v-model="questiontitle" type="text" id="questiontitle" class="maxcontainer" required><br><br>
                
                <label for="questionstatement" class="mincontainer">Question Statement:</label>
                <input v-model="questionstatement" type="text" id="questionstatement" class="maxcontainer" required><br><br>
                
                <h3>Options:</h3>
                <label for="option1" class="mincontainer">Option 1:</label>
                <input v-model="option1" type="text" id="option1" class="maxcontainer" required><br><br>
                
                <label for="option2" class="mincontainer">Option 2:</label>
                <input v-model="option2" type="text" id="option2" class="maxcontainer" required><br><br>
                
                <label for="option3" class="mincontainer">Option 3:</label>
                <input v-model="option3" type="text" id="option3" class="maxcontainer"><br><br>
                
                <label for="option4" class="mincontainer">Option 4:</label>
                <input v-model="option4" type="text" id="option4" class="maxcontainer"><br><br>
                
                <label for="correctAnswer" class="mincontainer">Correct Answer:</label>
                <select v-model="correctAnswer" class="maxcontainer" required>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                </select>
                <br><br>
                
                <button type="submit" class="maxocontainer">Save Changes</button>
                <br><br>
                <router-link to="/quiz-management" class="id50">Cancel</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            questiontitle: '',
            questionstatement: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: ''
        };
    },
    methods: {
        async fetchQuestion() {
            try {
                const token = localStorage.getItem('auth-token');
                const questionId = this.$route.params.id;
                const response = await fetch(`/api/question/get/${questionId}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                
                const data = await response.json();
                const question = data.find(q => q.id == questionId);
                if (question) {
                    this.questiontitle = question.title;
                    this.questionstatement = question.question_statement;
                    this.option1 = question.option1;
                    this.option2 = question.option2;
                    this.option3 = question.option3;
                    this.option4 = question.option4;
                    this.correctAnswer = question.correct_option;
                } else {
                    alert('Question not found');
                    this.$router.push('/quiz-management');
                }
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        },
        async updateQuestion() {
            try {
                const token = localStorage.getItem('auth-token');
                const questionId = this.$route.params.id;
                const response = await fetch(`/api/question/update/${questionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': localStorage.getItem("auth-token")
                    },
                    body: JSON.stringify({
                        title: this.questiontitle,
                        question_statement: this.questionstatement,
                        option1: this.option1,
                        option2: this.option2,
                        option3: this.option3,
                        option4: this.option4,
                        correct_option: this.correctAnswer
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
                console.error('Error updating question:', error);
            }
        }
    },
    mounted() {
        this.fetchQuestion();
    }
};

export default EditQuestion;