const AddQuiz = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="selectSubject" class="login12">
                <h3>Add New Quiz</h3>
                <label for="subject_id" class="mincontainer">Select Subject:</label>
                <select v-model="selectedSubject" class="maxcontainer" required>
                    <option value="" disabled selected>Select a Subject</option>
                    <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                        {{ subject.subjectname }}
                    </option>
                </select>
            </form>
            <br>
            
            <form v-if="selectedSubject" @submit.prevent="addQuiz" class="login12">
            <label for="chapter_id" class="mincontainer">Select Chapter:</label>
            <select v-model="selectedChapter" class="maxcontainer" required>
            <option value="" disabled selected>Select a Chapter</option>
            <option v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
                {{ chapter.chaptername }}
            </option>
            </select>
            <br><br>
            
            <label for="quizdate" class="mincontainer">Quiz Date:</label>
            <input v-model="quizdate" type="date" id="quizdate" class="maxcontainer" required><br><br>
            
            <label for="quiztime" class="mincontainer">Quiz Duration (minutes):</label>
            <input v-model="quiztime" type="number" id="quiztime" class="maxcontainer" min="1" required><br><br>
            
            <button type="submit" class="maxocontainer">Save</button>
            <br><br>
            <router-link to="/quiz-management" class="id50">Cancel</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            subjects: [],
            chapters: [],
            selectedSubject: '',
            selectedChapter: '',
            quizdate: '',
            quiztime: ''
        };
    },
    methods: {
        async fetchSubjects() {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch('/api/subject/get', {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                this.subjects = data.length ? data : [];
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        },
        async fetchChapters() {
            if (!this.selectedSubject) return;
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/chapter/get/${this.selectedSubject}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                this.chapters = data.length ? data : [];
            } catch (error) {
                console.error('Error fetching chapters:', error);
            }
        },
        async addQuiz() {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/quiz/create/${this.selectedChapter}`, {
                    method: 'POST',
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
                console.error('Error adding quiz:', error);
            }
        }
    },
    watch: {
        selectedSubject(newSubject) {
            if (newSubject) {
                this.fetchChapters();
            }
        }
    },
    mounted() {
        this.fetchSubjects();
    },
}    

export default AddQuiz;
