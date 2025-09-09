const RegisterPage = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="register" class="login12">
                <h2>Welcome to Quiz Master</h2>
                <h3>Create new account here</h3>
                <label for="email" class="mincontainer">Username (E-mail)</label>
                <input v-model="email" type="email" id="email" name="email" class="maxcontainer" required><br><br>
                
                <label for="password" class="mincontainer">Password</label>
                <input v-model="password" type="password" id="password" name="password" class="maxcontainer" required><br><br>
                
                <label for="fullname" class="mincontainer">Name</label>
                <input v-model="fullname" type="text" id="fullname" name="fullname" class="maxcontainer" required><br><br>
                
                <label for="qualification" class="mincontainer">Qualification</label>
                <input v-model="qualification" type="text" id="qualification" name="qualification" class="maxcontainer" required><br><br>
                
                <label for="dob" class="mincontainer">Date of Birth</label>
                <input v-model="dob" type="date" id="dob" name="dob" class="maxcontainer" required><br><br>
                
                <input type="submit" value="Submit" class="maxocontainer">
                <router-link to="/" class="id45">Existing login here?</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            email: '',
            password: '',
            fullname: '',
            qualification: '',
            dob: ''
        };
    },
    methods: {
        async register() {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password,
                        fullname: this.fullname,
                        qualification: this.qualification,
                        dob: this.dob
                    })
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    this.$router.push('/');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    }
};

export default RegisterPage;
