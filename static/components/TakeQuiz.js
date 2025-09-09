const TakeQuiz = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <h3>Time Remaining: {{ formattedTime }}</h3>

            <form @submit.prevent="saveAndNext" class="login12">
                <h3>Question Statement: {{ question.statement }}</h3>

                <input type="hidden" v-model="questionId">
                <input type="hidden" v-model="currentIndex">

                <div>
                <label v-for="(option, index) in question.options" :key="index">
                    <input type="radio" v-model="selectedAnswer" :value="index + 1" required> {{ option }}
                </label>
                </div>
                <br><br>

                <button type="submit" class="maxocontainer">Save and Next</button>
                <br><br>
                <router-link v-if="isLastQuestion" :to="'/submit-quiz/' + quizId" class="id50">Submit Quiz</router-link>
            </form>
        </div>
    </div>
    `,

    data() {
        return {
            quizId: this.$route.params.id,
            questionId: null,
            question: {
                statement: "",
                options: []
            },
            selectedAnswer: null,
            currentIndex: 0,
            totalQuestions: 0,
            timer: null,
            timeRemaining: 0 
        };
    },

    computed: {
        isLastQuestion() {
            return this.currentIndex + 1 === this.totalQuestions;
        },

        formattedTime() {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        }
    },

    methods: {
        async fetchQuestion() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`/api/take_quiz/${this.quizId}?index=${this.currentIndex}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });

                const data = await response.json();
                if (data.status === "success") {
                    this.questionId = data.question.question_id;
                    this.question.statement = data.question.statement;
                    this.question.options = data.question.options;
                    this.totalQuestions = data.total_questions;

                    
                    if (this.currentIndex === 0) {
                        this.startTimer(data.time_duration);
                    }
                } else {
                    alert(data.message);
                    this.$router.push("/user-dashboard");
                }
            } catch (error) {
                console.error("Error fetching question:", error);
            }
        },

        async saveAndNext() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`/api/take_quiz/${this.quizId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Token': localStorage.getItem("auth-token")
                    },
                    body: JSON.stringify({
                        question_id: this.questionId,
                        answer: this.selectedAnswer,
                        current_index: this.currentIndex
                    })
                });

                const data = await response.json();
                if (data.status === "success") {
                    this.currentIndex = data.next_index;
                    this.selectedAnswer = null;
                    this.fetchQuestion();
                } else if (data.status === "completed") {
                    this.submitQuiz();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error submitting answer:", error);
            }
        },

        startTimer(duration) {
            this.timeRemaining = duration * 60; 
            this.timer = setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--;
                } else {
                    clearInterval(this.timer);
                    this.submitQuiz();
                }
            }, 1000);
        },

        async submitQuiz() {
            try {
                clearInterval(this.timer); 

                const token = localStorage.getItem("auth-token");
                const response = await fetch(`/api/submit_quiz/${this.quizId}`, {
                    method: "POST",
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });

                const data = await response.json();
                if (data.status === "success") {
                    alert(`Quiz submitted! Your Score: ${data.marks}`);
                    this.$router.push("/user-dashboard");
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error submitting quiz:", error);
            }
        }
    },

    mounted() {
        this.fetchQuestion();
    },

    beforeDestroy() {
        clearInterval(this.timer);
    }
};

export default TakeQuiz;
