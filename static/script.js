import Home from './components/Home.js' 
import Register from './components/Register.js'
import Adminpage from './components/Adminpage.js'
import EditSubject from "./components/EditSubject.js"
import AddChapter from "./components/AddChapter.js"
import EditChapter from "./components/EditChapter.js"
import AddSubject from "./components/AddSubject.js"
import QuizManagement from './components/QuizManagement.js'
import EditQuiz from './components/EditQuiz.js'
import AddQuestion from './components/AddQuestion.js'
import EditQuestion from './components/EditQuestion.js'
import AddQuiz from './components/AddQuiz.js'
import AdminSummary from './components/AdminSummary.js'
import SearchResults from './components/SearchResults.js'
import UserDashboard from './components/UserDashboard.js'
import ViewQuiz from './components/ViewQuiz.js'
import TakeQuiz from './components/TakeQuiz.js'
import SubmitQuiz from './components/SubmitQuiz.js'
import ViewScores from './components/ViewScores.js'
import UserSummary from './components/UserSummary.js'
import SearchUser from './components/SearchUser.js'


const routes = [
    {path: '/', component: Home},
    {path: '/register', component: Register},
    { path: '/admin-dashboard', component: Adminpage },
    { path: '/edit-subject/:id', component: EditSubject },
    { path: '/add-chapter/:subject_id', component: AddChapter },
    { path: '/edit-chapter/:chapter_id', component: EditChapter },
    { path: '/add-subject', component: AddSubject },
    { path: '/quiz-management', component: QuizManagement },
    { path: '/edit-quiz/:id', component: EditQuiz },
    { path: '/add-question/:id', component: AddQuestion },
    { path: '/edit-question/:id', component: EditQuestion },
    { path: '/add-quiz/', component: AddQuiz },
    { path: '/admin-summary', component: AdminSummary },
    { path: "/search", component: SearchResults },
    { path: "/user-dashboard", component: UserDashboard },
    { path: "/view-quiz/:id", component: ViewQuiz },
    { path: "/take-quiz/:id", component: TakeQuiz },
    { path: "/submit-quiz/:id", component: SubmitQuiz },
    { path: "/view-scores", component: ViewScores },
    { path: "/user-summary", component: UserSummary },
    { path: "/search-user", component: SearchUser }
]


const router = new VueRouter({
    routes
})

const app = new Vue({
    el: "#app",
    router,
    template:`
    <router-view></router-view>
    `,
    data: {
        section: "Frontend"
    }
})