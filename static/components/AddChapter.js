const AddChapter = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="addChapter" class="login12">
                <h3>Add New Chapter</h3>
                <label for="chaptername" class="mincontainer">Name of Chapter:</label>
                <input v-model="chaptername" type="text" id="chaptername" name="chaptername" class="maxcontainer" required><br><br>
                
                <label for="chapterdescription" class="mincontainer">Chapter Description:</label>
                <input v-model="chapterdescription" type="text" id="chapterdescription" name="chapterdescription" class="maxcontainer" required><br><br>
                
                <input type="submit" value="Save" class="maxocontainer">
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
        async addChapter() {
            try {
                const token = localStorage.getItem('auth-token');
                const subjectId = this.$route.params.subject_id;
                const response = await fetch(`/api/chapter/create/${subjectId}`, {
                    method: 'POST',
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
                console.error('Error adding chapter:', error);
            }
        }
    }
};

export default AddChapter;
