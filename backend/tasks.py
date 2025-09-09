from celery import shared_task
import csv
import os
from flask import current_app
from .database import db  
from .models import Score, Quiz, Chapter, Subject, Question, User
from flask_mail import Message
import sys
import os


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "app")))


from app import app, mail 



@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report(user_id):
    try:
        
        scores = (
            db.session.query(Score, Quiz, Chapter, Subject)
            .join(Quiz, Score.quiz_id == Quiz.id)
            .join(Chapter, Quiz.chapter_id == Chapter.id)
            .join(Subject, Chapter.subject_id == Subject.id)
            .filter(Score.user_id == user_id)
            .all()
        )

        if not scores:
            return "No scores found"

        
        file_path = f"/tmp/report_{user_id}.csv"
        with open(file_path, "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Subject", "Chapter", "Score", "Total Questions", "Date"])
            
            for score, quiz, chapter, subject in scores:
                total_questions = Question.query.filter_by(quiz_id=quiz.id).count()
                writer.writerow([
                    subject.subjectname,
                    chapter.chaptername,
                    score.total_scored/total_questions,
                    total_questions,
                    quiz.date_of_quiz.strftime("%Y-%m-%d") if quiz.date_of_quiz else "N/A"
                ])
        
        return file_path  
    
    except Exception as e:
        return str(e)  


@shared_task(ignore_results=False, name="generate_and_email_csv")
def generate_csv_and_send_email(user_id, user_email):
    
    try:
        
        scores = (
            db.session.query(Score, Quiz, Chapter, Subject)
            .join(Quiz, Score.quiz_id == Quiz.id)
            .join(Chapter, Quiz.chapter_id == Chapter.id)
            .join(Subject, Chapter.subject_id == Subject.id)
            .filter(Score.user_id == user_id)
            .all()
        )

        if not scores:
            return "No scores found"


        file_path = f"/tmp/report_{user_id}.csv"
        with open(file_path, "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Subject", "Chapter", "Score", "Total Questions", "Date"])
            
            for score, quiz, chapter, subject in scores:
                total_questions = Question.query.filter_by(quiz_id=quiz.id).count()
                writer.writerow([
                    subject.subjectname,
                    chapter.chaptername,
                    score.total_scored,
                    total_questions,
                    quiz.date_of_quiz.strftime("%Y-%m-%d") if quiz.date_of_quiz else "N/A"
                ])

        
        with app.app_context():
            msg = Message(
                subject="Your Quiz Report",
                recipients=[user_email],
                body="Here is your quiz report in CSV format.",
            )
            with open(file_path, "rb") as f:
                msg.attach("quiz_report.csv", "text/csv", f.read())

            mail.send(msg)

        
        os.remove(file_path)

        return f"CSV sent to {user_email}"

    except Exception as e:
        return str(e)


