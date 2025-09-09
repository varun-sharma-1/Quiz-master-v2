const EditChapter = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="updateChapter" class="login12">
                <h3>Update Chapter</h3>
                <label for="chaptername" class="mincontainer">Name of Chapter:</label>
                <input v-model="chaptername" type="text" id="chaptername" name="chaptername" class="maxcontainer" required><br><br>
                
                <label for="chapterdescription" class="mincontainer">Chapter Description:</label>
                <input v-model="chapterdescription" type="text" id="chapterdescription" name="chapterdescription" class="maxcontainer" required><br><br>
                
                <input type="submit" value="Update Chapter" class="maxocontainer">
                <br><br>
                <router-link to="/admin-dashboard" class="id50">Cancel</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            chaptername: '',
            chapterdescription: ''
        };
    },
    methods: {
        async fetchChapter() {
            try {
                const token = localStorage.getItem('auth-token');
                const chapterId = this.$route.params.chapter_id;
                const response = await fetch(`/api/chapter/get/${chapterId}`, {
                    headers: { 'Token': localStorage.getItem("auth-token") }
                });
                
                const chapters = await response.json();
                const chapter = chapters.find(chap => chap.id == chapterId);
                if (chapter) {
                    this.chaptername = chapter.chaptername;
                    this.chapterdescription = chapter.chapterdescription;
                } else {
                    alert('Chapter not found');
                    this.$router.push('/admin-dashboard');
                }
            } catch (error) {
                console.error('Error fetching chapter:', error);
            }
        },
        async updateChapter() {
            try {
                const token = localStorage.getItem('auth-token');
                const chapterId = this.$route.params.chapter_id;
                const response = await fetch(`/api/chapter/update/${chapterId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': localStorage.getItem("auth-token")
                    },
                    body: JSON.stringify({
                        chaptername: this.chaptername,
                        chapterdescription: this.chapterdescription
                    })
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    this.$router.push('/admin-dashboard');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error updating chapter:', error);
            }
        }
    },
    mounted() {
        this.fetchChapter();
    }
};

export default EditChapter;
