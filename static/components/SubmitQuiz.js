const SubmitQuiz = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <h3>Quiz Completed!</h3>
            <p>Your Score: {{ score }}/{{ totalQuestions }}</p>
            <router-link to="/user-dashboard" class="id50">Return to Dashboard</router-link>
        </div>
    </div>
    `,

    data() {
        return {
            quizId: this.$route.params.id,
            score: 0,
            totalQuestions: 0
        };
    },

    methods: {
        async submitQuiz() {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/submit_quiz/${this.quizId}`, {
                    method: "POST",
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });

                const data = await response.json();
                if (data.status === "success") {
                    this.score = data.total_correct;
                    this.totalQuestions = data.total_questions;
                } else {
                    alert(data.message);
                    this.$router.push("/user-dashboard");
                }
            } catch (error) {
                console.error("Error submitting quiz:", error);
            }
        }
    },

    mounted() {
        this.submitQuiz();
    }
};

export default SubmitQuiz;
