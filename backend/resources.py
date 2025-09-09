from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted, current_user
from datetime import datetime
from flask import jsonify, request, Flask, session
import calendar
from collections import Counter
from celery import shared_task
from flask_mail import Message
from jinja2 import Template
api = Api()


def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list

def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)

parser = reqparse.RequestParser()

parser.add_argument('subjectname')
parser.add_argument('subjectdescription')

class SubApi(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self):
        subjects = []
        sub_json = []
        if 'admin' in roles_list(current_user.roles):
            subjects = Subject.query.all()

        for subject in subjects:
            this_sub = {}
            this_sub['id'] = subject.id
            this_sub['subjectname'] = subject.subjectname
            this_sub['subjectdescription'] = subject.subjectdescription
            sub_json.append(this_sub)

        if sub_json:
            return sub_json

        return {
            'message': "No subject found"
        }

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = parser.parse_args()
        try:
            subject = Subject(subjectname = args['subjectname'],
            subjectdescription = args['subjectdescription'])
            db.session.add(subject)
            db.session.commit()
            return {
                'message': 'subject add successfully'
            }
        except:
            return {
                'message': 'one or more field required'
            }

    @auth_required('token')
    @roles_required('admin')
    def put(self, sub_id):
        args = parser.parse_args()
        sub = Subject.query.get(sub_id)
        sub.subjectname = args['subjectname']
        sub.subjectdescription = args['subjectdescription']
        db.session.commit()
        return {
            "message": "subject updated"
        }

    @auth_required('token')
    @roles_required('admin')
    def delete(self, sub_id):
        sub = Subject.query.get(sub_id)
        if sub:
            db.session.delete(sub)
            db.session.commit()
            return {
                'message': "subject deleted"
            }
        else:
            return {
                "message": "something went wrong"
            }

api.add_resource(SubApi, '/api/subject/get', '/api/subject/create', '/api/subject/update/<int:sub_id>', '/api/subject/delete/<int:sub_id>')


parser.add_argument('chaptername')
parser.add_argument('chapterdescription')

class ChapApi(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self, subject_id):
        chapters = []
        chap_json = []
        if 'admin' in roles_list(current_user.roles):
            chapters = Chapter.query.all()

        for chapter in chapters:
            this_chap = {}
            this_chap['id'] = chapter.id
            this_chap['chaptername'] = chapter.chaptername
            this_chap['chapterdescription'] = chapter.chapterdescription
            chap_json.append(this_chap)

        if chap_json:
            return chap_json

        return {
            'message': "No chapter found"
        }

    @auth_required('token')
    @roles_required('admin')
    def post(self, subject_id):
        args = parser.parse_args()

        subject = Subject.query.get(subject_id)
        if not subject:
            return {'message': 'Invalid subject ID, subject not found'}

        try:
            chapter = Chapter(chaptername = args['chaptername'],
            chapterdescription = args['chapterdescription'],
            subject_id = subject_id)
            db.session.add(chapter)
            db.session.commit()
            return {
                'message': 'chapter add successfully'
            }
        except Exception as e:
            return {
                'message': f'Error: {str(e)}'
            }

    @auth_required('token')
    @roles_required('admin')
    def put(self, chap_id):
        args = parser.parse_args()
        chap = Chapter.query.get(chap_id)
        chap.chaptername = args['chaptername']
        chap.chapterdescription = args['chapterdescription']
        db.session.commit()
        return {
            "message": "chapter updated"
        }

    @auth_required('token')
    @roles_required('admin')
    def delete(self, chap_id):
        chap = Chapter.query.get(chap_id)
        if chap:
            db.session.delete(chap)
            db.session.commit()
            return {
                'message': "chapter deleted"
            }
        else:
            return {
                "message": "something went wrong"
            }

api.add_resource(ChapApi, '/api/chapter/get/<int:subject_id>', '/api/chapter/create/<int:subject_id>', '/api/chapter/update/<int:chap_id>', '/api/chapter/delete/<int:chap_id>')



parser.add_argument('date_of_quiz')
parser.add_argument('time_duration')

class QuizApi(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self, chapter_id):
        quizzes = []
        qui_json = []
        if 'admin' in roles_list(current_user.roles):
            quizzes = Quiz.query.all()

        for quiz in quizzes:
            this_qui = {}
            this_qui['id'] = quiz.id
            this_qui['date_of_quiz'] = quiz.date_of_quiz.strftime("%Y-%m-%d")
            this_qui['time_duration'] = quiz.time_duration
            qui_json.append(this_qui)

        if qui_json:
            return qui_json

        return {
            'message': "No quiz found"
        }

    @auth_required('token')
    @roles_required('admin')
    def post(self, chapter_id):
        args = parser.parse_args()
        print("Received Data:", args) 

        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'Invalid chapter ID, chapter not found'}

        date_of_quiz = datetime.strptime(args['date_of_quiz'], "%Y-%m-%d").date()

        try:
            quiz = Quiz(date_of_quiz = date_of_quiz,
            time_duration = args['time_duration'],
            chapter_id = chapter_id)
            db.session.add(quiz)
            db.session.commit()

        except Exception as e:
            return {
                'message': f'Error: {str(e)}'
            }

    @auth_required('token')
    @roles_required('admin')
    def put(self, qui_id):
        args = parser.parse_args()

        date_of_quiz = datetime.strptime(args['date_of_quiz'], "%Y-%m-%d").date()

        qui = Quiz.query.get(qui_id)
        qui.date_of_quiz = date_of_quiz
        qui.time_duration = args['time_duration']
        db.session.commit()
        return {
            "message": "quiz updated"
        }

    @auth_required('token')
    @roles_required('admin')
    def delete(self, qui_id):
        qui = Quiz.query.get(qui_id)
        if qui:
            db.session.delete(qui)
            db.session.commit()
            return {
                'message': "quiz deleted"
            }
        else:
            return {
                "message": "something went wrong"
            }

api.add_resource(QuizApi, '/api/quiz/get/<int:chapter_id>', '/api/quiz/create/<int:chapter_id>', '/api/quiz/update/<int:qui_id>', '/api/quiz/delete/<int:qui_id>')


parser.add_argument('title')
parser.add_argument('question_statement')
parser.add_argument('option1')
parser.add_argument('option2')
parser.add_argument('option3')
parser.add_argument('option4')
parser.add_argument('correct_option')


class QuestionApi(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self, quiz_id):
        questions = []
        ques_json = []
        if 'admin' in roles_list(current_user.roles):
            questions = Question.query.all()

        for question in questions:
            this_ques = {}
            this_ques['id'] = question.id
            this_ques['title'] = question.title
            this_ques['question_statement'] = question.question_statement
            this_ques['option1'] = question.option1
            this_ques['option2'] = question.option2
            this_ques['option3'] = question.option3
            this_ques['option4'] = question.option4
            this_ques['correct_option'] = question.correct_option
            ques_json.append(this_ques)

        if ques_json:
            return ques_json

        return {
            'message': "No question found"
        }

    @auth_required('token')
    @roles_required('admin')
    def post(self, quiz_id):
        args = parser.parse_args()

        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {'message': 'Invalid quiz ID, quiz not found'}

        try:
            question = Question(title = args['title'],
            question_statement = args['question_statement'],
            option1 = args['option1'],
            option2 = args['option2'],
            option3 = args['option3'],
            option4 = args['option4'],
            correct_option = args['correct_option'],
            quiz_id = quiz_id)
            db.session.add(question)
            db.session.commit()
            return {
                'message': 'question add successfully'
            }
        except Exception as e:
            return {
                'message': f'Error: {str(e)}'
            }

    @auth_required('token')
    @roles_required('admin')
    def put(self, ques_id):
        args = parser.parse_args()


        ques = Question.query.get(ques_id)
        ques.title = args['title']
        ques.question_statement = args['question_statement']
        ques.option1 = args['option1']
        ques.option2 = args['option2']
        ques.option3 = args['option3']
        ques.option4 = args['option4']
        ques.correct_option = args['correct_option']
        db.session.commit()
        return {
            "message": "question updated"
        }

    @auth_required('token')
    @roles_required('admin')
    def delete(self, ques_id):
        ques = Question.query.get(ques_id)
        if ques:
            db.session.delete(ques)
            db.session.commit()
            return {
                'message': "question deleted"
            }
        else:
            return {
                "message": "something went wrong"
            }

api.add_resource(QuestionApi, '/api/question/get/<int:quiz_id>', '/api/question/create/<int:quiz_id>', '/api/question/update/<int:ques_id>', '/api/question/delete/<int:ques_id>')


class UserDashboardAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def get(self):
        
        all_quizzes = Quiz.query.join(Chapter).add_columns(
            Quiz.id, Quiz.date_of_quiz, Quiz.time_duration, Chapter.chaptername
        ).all()

        
        completed_quizzes = {quiz_id for (quiz_id,) in Score.query.with_entities(Score.quiz_id)
                             .filter_by(user_id=current_user.id).all()}

        
        available_quizzes = [
            {
                "quiz_id": quiz.id,
                "date_of_quiz": quiz.date_of_quiz.strftime("%d/%m/%Y"),  
                "time_duration": quiz.time_duration,
                "chapter_name": quiz.chaptername
            }
            for quiz in all_quizzes if quiz.id not in completed_quizzes
        ]

        return jsonify({"status": "success", "available_quizzes": available_quizzes})


api.add_resource(UserDashboardAPI, "/api/user_dashboard")



class SearchAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self):
        query = request.args.get('query', '').strip()  

        if not query:
            return {"status": "error", "message": "Please enter a search term."}, 400  

        
        query_id = int(query) if query.isdigit() else None

        
        users = User.query.filter(User.email.ilike(f"%{query}%")).all()

        
        subjects = Subject.query.filter(Subject.subjectname.ilike(f"%{query}%")).all()

        quizzes = Quiz.query.filter(Quiz.date_of_quiz.ilike(f"%{query}%")).all()

        questions = Question.query.filter(Question.title.ilike(f"%{query}%")).all()
        


        
        return {
            "status": "success",
            "query": query,
            "users": [{"id": u.id, "email": u.email, "fullname": u.fullname} for u in users],
            "subjects": [{"id": subject.id, "subjectname": subject.subjectname} for subject in subjects],
            "quizzes": [{"id": quiz.id, "date_of_quiz": quiz.date_of_quiz} for quiz in quizzes],
            "questions": [{"id": question.id, "title": question.title,"question_statement": question.question_statement} for question in questions]
        }, 200  




api.add_resource(SearchAPI, "/api/search")


class SearchUserAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def get(self):
        query = request.args.get('query', '').strip().lower()

        if not query:
            return {"status": "error", "message": "Please enter a search term!"}, 400

        
        matching_subjects = Subject.query.filter(Subject.subjectname.ilike(f"%{query}%")).all()

        
        matching_quizzes = (
            db.session.query(Quiz.id, Quiz.date_of_quiz, Quiz.time_duration, Chapter.chaptername, Subject.subjectname)
            .join(Chapter, Quiz.chapter_id == Chapter.id)
            .join(Subject, Chapter.subject_id == Subject.id)
            .filter(Chapter.chaptername.ilike(f"%{query}%"))
            .all()
        )

        
        subjects_list = [{"id": s.id, "subjectname": s.subjectname} for s in matching_subjects]

        quizzes_list = [
            {
                "quiz_id": q[0],  
                "date_of_quiz": q[1].strftime("%d/%m/%Y"),  
                "time_duration": q[2],
                "chapter_name": q[3],
                "subject_name": q[4]
            }
            for q in matching_quizzes
        ]

        return {
            "status": "success",
            "query": query,
            "subjects": subjects_list,
            "quizzes": quizzes_list
        }, 200


api.add_resource(SearchUserAPI, "/api/search_user")


class ViewQuizAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def get(self, quiz_id):
        
        quiz = Quiz.query.get_or_404(quiz_id)

        
        chapter = Chapter.query.get(quiz.chapter_id)
        subject = Subject.query.get(chapter.subject_id) if chapter else None

        
        if not chapter or not subject:
            return {"status": "error", "message": "Chapter or Subject not found for this quiz!"}, 404

        
        quiz_data = {
            "quiz_id": quiz.id,
            "date_of_quiz": quiz.date_of_quiz.strftime("%Y-%m-%d"),  
            "time_duration": quiz.time_duration,
            "chapter": {
                "id": chapter.id,
                "chapter_name": chapter.chaptername
            },
            "subject": {
                "id": subject.id,
                "subject_name": subject.subjectname
            }
        }

        return {"status": "success", "quiz": quiz_data}, 200


api.add_resource(ViewQuizAPI, "/api/view_quiz/<int:quiz_id>")



class TakeQuizAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def get(self, quiz_id):
        
        quiz = Quiz.query.get_or_404(quiz_id)

        
        today_date = datetime.today().date()
        quiz_date = quiz.date_of_quiz  

        if today_date < quiz_date:
            return {"status": "error", "message": "This quiz is not available yet!"}, 403

        
        questions = Question.query.filter_by(quiz_id=quiz_id).all()

        
        if f'quiz_{quiz_id}_answers' not in session:
            session[f'quiz_{quiz_id}_answers'] = {}

        
        index = int(request.args.get('index', 0))

        if index >= len(questions):
            return {"status": "error", "message": "No more questions available!"}, 400

        
        question = questions[index]

        
        return {
            "status": "success",
            "quiz_id": quiz.id,
            "time_duration": quiz.time_duration,  
            "question": {
                "question_id": question.id,
                "statement": question.question_statement,
                "options": [question.option1, question.option2, question.option3, question.option4]
            },
            "current_index": index,
            "total_questions": len(questions)
        }, 200

    def post(self, quiz_id):
        
        quiz = Quiz.query.get_or_404(quiz_id)
        today_date = datetime.today().date()
        quiz_date = quiz.date_of_quiz

        if today_date < quiz_date:
            return {"status": "error", "message": "This quiz is not available yet!"}, 403

        if today_date > quiz_date:
            return {"status": "error", "message": "You are late , better luck next time!"}, 403


        
        questions = Question.query.filter_by(quiz_id=quiz_id).all()

        
        data = request.get_json()
        question_id = data.get('question_id')
        selected_option = data.get('answer')
        current_index = int(data.get('current_index', 0))

        if question_id and selected_option:
            session[f'quiz_{quiz_id}_answers'][question_id] = selected_option  

        print("Session Data Before Storing:", session.get(f'quiz_{quiz_id}_answers', {}))

        
        if current_index + 1 < len(questions):
            return {"status": "success", "next_index": current_index + 1}, 200
        else:
            return {"status": "completed", "message": "Quiz completed! Redirect to submit."}, 200


api.add_resource(TakeQuizAPI, "/api/take_quiz/<int:quiz_id>")


class SubmitQuizAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def post(self, quiz_id):
        user_id = current_user.id  

        
        user_answers = session.get(f'quiz_{quiz_id}_answers', {})

        
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        correct_answers = {str(q.id): q.correct_option for q in questions}

        
        total_correct = sum(1 for q_id, ans in user_answers.items() if str(ans) == str(correct_answers.get(str(q_id))))
        total_questions = len(questions)

        print("Stored User Answers:", user_answers)
        print("Correct Answers:", correct_answers)

        
        score = Score(user_id=user_id, quiz_id=quiz_id, total_scored=total_correct)
        db.session.add(score)
        db.session.commit()

        
        session.pop(f'quiz_{quiz_id}_answers', None)

        return jsonify({
            "status": "success",
            "quiz_id": quiz_id,
            "total_correct": total_correct,
            "total_questions": total_questions,
            "marks": f"{total_correct}/{total_questions}"
        })


api.add_resource(SubmitQuizAPI, "/api/submit_quiz/<int:quiz_id>")


class ViewScoresAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def get(self):
        user_id = current_user.id  

        
        scores = (
            db.session.query(Score, Quiz, Chapter, Subject)
            .join(Quiz, Score.quiz_id == Quiz.id)
            .join(Chapter, Quiz.chapter_id == Chapter.id)
            .join(Subject, Chapter.subject_id == Subject.id)
            .filter(Score.user_id == user_id)
            .all()
        )

        
        formatted_scores = []
        for score, quiz, chapter, subject in scores:
            total_questions = Question.query.filter_by(quiz_id=quiz.id).count()

            formatted_scores.append({
                #"quiz_id": str(score.quiz_id),
                "subject": subject.subjectname,
                "chapter": chapter.chaptername,
                "total_scored": score.total_scored,
                "total_questions": total_questions,
                "marks": f"{score.total_scored}/{total_questions}",
                "date_of_quiz": score.quiz.date_of_quiz.strftime("%Y-%m-%d") if score.quiz and score.quiz.date_of_quiz else "N/A"
            })

        return jsonify({"status": "success", "scores": formatted_scores})


api.add_resource(ViewScoresAPI, "/api/view_scores")


class AdminSummaryApi(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self):
        subjects = Subject.query.all()

        subject_top_scores = {}
        subject_attempts = {}

        for subject in subjects:
            quizzes = Quiz.query.join(Chapter).filter(Chapter.subject_id == subject.id).all()

            top_scores = []
            total_attempts = sum(Score.query.filter_by(quiz_id=quiz.id).count() for quiz in quizzes)

            for quiz in quizzes:
                scores = Score.query.filter_by(quiz_id=quiz.id).order_by(Score.total_scored.desc()).limit(1).all()
                if scores:
                    top_scores.append(scores[0].total_scored)

            subject_top_scores[subject.subjectname] = max(top_scores) if top_scores else 0
            subject_attempts[subject.subjectname] = total_attempts

        return {
            "top_scores": subject_top_scores or {},
            "subject_attempts": subject_attempts or {}
        }


api.add_resource(AdminSummaryApi, "/api/admin_summary")




class UserSummaryAPI(Resource):
    @auth_required('token')
    @roles_accepted('user')
    def get(self):
        user_id = current_user.id  

        
        subject_quiz_counts = dict(
            db.session.query(Subject.subjectname, db.func.count(Quiz.id))
            .join(Chapter, Subject.id == Chapter.subject_id)
            .join(Quiz, Chapter.id == Quiz.chapter_id)
            .group_by(Subject.subjectname)
            .all()
        )

        
        quiz_attempts = (
            db.session.query(db.func.strftime('%m', Score.time_stamp_of_attempt))
            .filter(Score.user_id == user_id)
            .all()
        )
        month_counts = Counter([calendar.month_name[int(month[0])] for month in quiz_attempts if month[0]])

        return {
            "subject_quiz_counts": subject_quiz_counts,
            "month_counts": month_counts
        }


api.add_resource(UserSummaryAPI, "/api/user_summary")



class QuizManagementAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')  
    def get(self):
        subjects = Subject.query.all()  

        
        subject_chapter_quizzes = []

        for subject in subjects:
            subject_data = {
                "subject_id": subject.id,
                "subject_name": subject.subjectname,
                "chapters": []
            }

            for chapter in subject.chapters:
                quizzes_for_chapter = Quiz.query.filter_by(chapter_id=chapter.id).all()
                questions_for_chapter = Question.query.filter(Question.quiz_id.in_([quiz.id for quiz in quizzes_for_chapter])).all()

                chapter_data = {
                    "chapter_id": chapter.id,
                    "chapter_name": chapter.chaptername,
                    "quizzes": [
                        {
                            "quiz_id": quiz.id,
                            "date_of_quiz": quiz.date_of_quiz.strftime("%d/%m/%Y"),
                            "time_duration": quiz.time_duration
                        } for quiz in quizzes_for_chapter
                    ],
                    "questions": [
                        {
                            "question_id": question.id,
                            "question_text": question.title,
                            "quiz_id": question.quiz_id
                        } for question in questions_for_chapter
                    ]
                }

                subject_data["chapters"].append(chapter_data)

            subject_chapter_quizzes.append(subject_data)

        return jsonify({
            "status": "success",
            "quiz_management_data": subject_chapter_quizzes
        })


api.add_resource(QuizManagementAPI, "/api/quiz_management")



class LogoutAPI(Resource):
    def post(self):
        session.pop("username", None)  
        return {"message": "Logged out successfully"}, 200  


api.add_resource(LogoutAPI, "/api/logout")