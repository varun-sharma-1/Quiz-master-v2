const EditSubject = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="updateSubject" class="login12">
                <h3>Update Subject</h3>
                <label for="subjectname" class="mincontainer">Name of Subject:</label>
                <input v-model="subjectname" type="text" id="subjectname" name="subjectname" class="maxcontainer" required><br><br>
                
                <label for="subjectdescription" class="mincontainer">Subject Description:</label>
                <input v-model="subjectdescription" type="text" id="subjectdescription" name="subjectdescription" class="maxcontainer" required><br><br>
                
                <input type="submit" value="Update Subject" class="maxocontainer">
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
        async fetchSubject() {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    alert("Unauthorized: No auth token found.");
                    console.error(" Auth token is missing in localStorage.");
                    this.$router.push('/login');
                    return;
                }
        
                console.log(" Sending request with token:", token);
        
                const response = await fetch(`/api/subject/get`, {
                    headers: { 
                        'Token': localStorage.getItem("auth-token")
                    }
                });
        
                console.log("🔍 HTTP Status:", response.status);
                const text = await response.text();  
                console.log("🔍 Raw Response:", text);  
        
                
                if (!response.headers.get("content-type")?.includes("application/json")) {
                    console.error(" Response is not JSON. Possible HTML error page.");
                    alert("Error: Server returned an unexpected response. Check console for details.");
                    return;
                }
        
                const subjects = JSON.parse(text);  
        
                const subject = subjects.find(sub => sub.id == this.$route.params.id);
                if (subject) {
                    this.subjectname = subject.subjectname;
                    this.subjectdescription = subject.subjectdescription;
                } else {
                    alert('Subject not found');
                    this.$router.push('/admin-dashboard');
                }
            } catch (error) {
                console.error(' Error fetching subject:', error);
            }
        },
        async updateSubject() {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await fetch(`/api/subject/update/${this.$route.params.id}`, {
                    method: 'PUT',
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
                if (response.ok) {
                    alert(data.message);
                    this.$router.push('/admin-dashboard');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error updating subject:', error);
            }
        }
    },
    mounted() {
        this.fetchSubject();
    }
};

export default EditSubject;
