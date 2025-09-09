const ViewQuiz = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form class="login12">
                <h3> Quiz Details </h3>

                <label class="mincontainer">Subject Name :</label>
                <input class="maxcontainer" type="text" :value="subjectName" readonly><br><br>

                <label class="mincontainer">Chapter Name :</label>
                <input class="maxcontainer" type="text" :value="chapterName" readonly><br><br>

                <label class="mincontainer">Quiz Date :</label>
                <input class="maxcontainer" type="date" :value="quizDate" readonly><br><br>

                <label class="mincontainer">Quiz Duration (minutes) :</label>
                <input class="maxcontainer" type="number" :value="quizTime" readonly><br><br>

                <router-link to="/user-dashboard" class="id50">Close</router-link>
            </form>
        </div>
    </div>
    `,

    data() {
        return {
            subjectName: "",
            chapterName: "",
            quizDate: "",
            quizTime: ""
        };
    },

    methods: {
        async fetchQuizDetails() {
            try {
                const quizId = this.$route.params.id;  
                const token = localStorage.getItem('auth-token');

                const response = await fetch(`/api/view_quiz/${quizId}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });

                const data = await response.json();
                if (data.status === "success") {
                    this.subjectName = data.quiz.subject.subject_name;
                    this.chapterName = data.quiz.chapter.chapter_name;
                    this.quizDate = data.quiz.date_of_quiz.split("/").reverse().join("-"); 
                    this.quizTime = data.quiz.time_duration;
                } else {
                    alert("Quiz not found!");
                    this.$router.push("/user-dashboard");
                }
            } catch (error) {
                console.error("Error fetching quiz details:", error);
            }
        }
    },

    mounted() {
        this.fetchQuizDetails();
    }
};

export default ViewQuiz;
