const AddQuestion = {
    template: `
    <div class="mainoncontainer">
        <div class="container">
            <form @submit.prevent="addQuestion" class="login12">
                <h2>Add New Question</h2>
                <label for="questiontitle" class="mincontainer">Question Title:</label>
                <input v-model="questiontitle" type="text" id="questiontitle" class="maxcontainer" required><br><br>
                
                <label for="questionstatement" class="mincontainer">Question Statement:</label>
                <input v-model="questionstatement" type="text" id="questionstatement" class="maxcontainer" required><br><br>
                
                <h3>Single Option Correct</h3>
                <label for="option1" class="mincontainer">Option 1:</label>
                <input v-model="option1" type="text" id="option1" class="maxcontainer" required><br><br>
                
                <label for="option2" class="mincontainer">Option 2:</label>
                <input v-model="option2" type="text" id="option2" class="maxcontainer" required><br><br>
                
                <label for="option3" class="mincontainer">Option 3:</label>
                <input v-model="option3" type="text" id="option3" class="maxcontainer" required><br><br>
                
                <label for="option4" class="mincontainer">Option 4:</label>
                <input v-model="option4" type="text" id="option4" class="maxcontainer" required><br><br>
                
                <label for="correctAnswer" class="mincontainer">Correct Answer:</label>
                <select v-model="correctAnswer" class="maxcontainer" required>
                    <option value="" disabled selected>Select the correct answer</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                </select>
                
                <button type="submit" class="maxocontainer">Save and Next</button>
                <br><br>
                <router-link to="/quiz-management" class="id50">Close</router-link>
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
        async addQuestion() {
            try {
                const token = localStorage.getItem('auth-token');
                const quizId = this.$route.params.id;
                const response = await fetch(`/api/question/create/${quizId}`, {
                    method: 'POST',
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
                console.error('Error adding question:', error);
            }
        }
    }
};

export default AddQuestion;
