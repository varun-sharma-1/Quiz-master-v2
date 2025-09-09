const AddSubject = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="addSubject" class="login12">
                <h3>Add New Subject</h3>
                <label for="subjectname" class="mincontainer">Name of Subject:</label>
                <input v-model="subjectname" type="text" id="subjectname" name="subjectname" class="maxcontainer" required><br><br>
                
                <label for="subjectdescription" class="mincontainer">Subject Description:</label>
                <input v-model="subjectdescription" type="text" id="subjectdescription" name="subjectdescription" class="maxcontainer" required><br><br>
                
                <input type="submit" value="Save" class="maxocontainer">
                <br><br>
                <router-link to="/admin-dashboard" class="id50">Cancel</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            subjectname: '',
            subjectdescription: ''
        };
    },
    methods: {
        async addSubject() {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    alert("Unauthorized: No auth token found.");
                    this.$router.push('/login');  
                    return;
                }

                console.log("Sending request with token:", token);
        
                const response = await fetch('/api/subject/create',{
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Token': localStorage.getItem("auth-token")  
                    },
                    body: JSON.stringify({
                        subjectname: this.subjectname,
                        subjectdescription: this.subjectdescription
                    })
                });
        
                const data = await response.json();
                console.log("API Response:", data);  
                console.log("HTTP Status:", response.status)
        
                if (response.ok) {
                    alert(data.message);
                    this.$router.push('/admin-dashboard');  
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error adding subject:', error);
            }
        }        
    }
};

export default AddSubject;
