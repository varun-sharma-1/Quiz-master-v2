const LoginPage = {
    template: `
    <div class="maincontainer">
        <div class="container">
            <form @submit.prevent="login" class="login12">
                <h2>Welcome to Quiz Master</h2>
                <h3>Login Here</h3>
                <label for="email" class="mincontainer">Email</label>
                <input v-model="email" type="email" id="email" name="email" class="maxcontainer" required><br><br>
                
                <label for="password" class="mincontainer">Password</label>
                <input v-model="password" type="password" id="password" name="password" class="maxcontainer" required><br><br>
                
                <input type="submit" value="Login" class="maxocontainer">
                <router-link to="/register" class="id45">Create new account here?</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async login() {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password })
                });
                
                const data = await response.json();
                console.log("Response Data:", data);
                if (response.ok) {
                    localStorage.setItem('auth-token', data["auth-token"]);
                    alert('Login successful!');
                    
                    if (data.role === 'admin') {
                        this.$router.push('/admin-dashboard');
                    } else if (data.role === 'user') {
                        this.$router.push('/user-dashboard');
                    }else {
                        alert('wrong email or password')
                    }
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    }
};

export default LoginPage;
