const Adminpage = {
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
            <div class="subject-container">
                <div v-for="subject in subjects" :key="subject.subject_id" class="subject-section">
                    <h3>{{ subject.subject_name }}</h3>
                    <div class="subject-actions">
                        <router-link :to="'/edit-subject/' + subject.subject_id" class="btn edit-btn">Edit Subject</router-link>
                        <button @click="deleteSubject(subject.subject_id)" class="btn delete-btn">Delete Subject</button>
                        <router-link :to="'/add-chapter/' + subject.subject_id" class="btn add-btn">Add Chapter</router-link>
                    </div>
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th scope="col">Chapter Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="chapter in subject.chapters" :key="chapter.chapter_id">
                                <td>{{ chapter.chapter_name }}</td>
                                <td>
                                    <router-link :to="'/edit-chapter/' +chapter.chapter_id" class="btn edit-btn">Edit</router-link>
                                    <button @click="deleteChapter(chapter.chapter_id)" class="btn delete-btn">Delete</button>
                                </td>  
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        <footer>
            <router-link to="/add-subject" class="id90">New Subject</router-link>
        </footer>
    </div>
    `,
    data() {
        return {
            subjects: [],
            query: ''
        };
    },
    methods: {
        async fetchSubjects() {
            try {
                const token = localStorage.getItem('auth-token');
        
                if (!token) {
                    alert("Unauthorized: No auth token found.");
                    console.error(" Auth token is missing in localStorage.");
                    this.$router.push('/login');
                    return;
                }
        
                console.log(" Sending request with token:", token);
        
                const response = await fetch('/api/admin_home', {
                    headers: { 
                        'Token': localStorage.getItem("auth-token")  
                    }
                });
        
                console.log(" HTTP Status:", response.status);
                const text = await response.text();  
                console.log(" Raw Response:", text);  
        
                try {
                    const data = JSON.parse(text);  
                    if (data.status === 'success') {
                        this.subjects = data.admin_home_data;
                    } else {
                        alert('Failed to fetch subjects');
                    }
                } catch (jsonError) {
                    console.error(" JSON Parse Error:", jsonError);
                    console.error(" Response was:", text);
                    alert("Error: Server did not return valid JSON. Check console for details.");
                }
        
            } catch (error) {
                console.error(' Error fetching subjects:', error);
            }
        },
        async deleteSubject(subjectId) {
            if (!confirm('Are you sure you want to delete this subject?')) return;
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/subject/delete/${subjectId}`, {
                    method: 'DELETE',
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                alert(data.message);
                this.fetchSubjects();
            } catch (error) {
                console.error('Error deleting subject:', error);
            }
        },
        async deleteChapter(chapterId) {
            if (!confirm('Are you sure you want to delete this chapter?')) return;
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`/api/chapter/delete/${chapterId}`, {
                    method: 'DELETE',
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                const data = await response.json();
                alert(data.message);
                this.fetchSubjects();
            } catch (error) {
                console.error('Error deleting chapter:', error);
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
        this.fetchSubjects();
    }
};

export default Adminpage;
