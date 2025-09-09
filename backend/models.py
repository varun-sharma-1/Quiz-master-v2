from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    fullname = db.Column(db.String(150), nullable=False)
    qualification = db.Column(db.String(150), nullable=False)
    dob = db.Column(db.Integer, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    roles = db.relationship('Role', backref = 'users', secondary = 'users_roles')
    scores = db.relationship('Score', back_populates='user')


class Role(db.Model,RoleMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.String)


class UsersRoles(db.Model):
    __tablename__ = 'users_roles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

        
class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True)
    subjectname = db.Column(db.String(150), nullable=False, unique=True)
    subjectdescription = db.Column(db.String(150), nullable=False, unique=True)
    chapters = db.relationship('Chapter', back_populates='subject')


class Chapter(db.Model):
    __tablename__ = 'chapters'
    id = db.Column(db.Integer, primary_key=True)
    chaptername = db.Column(db.String(150), nullable=False, unique=True)
    chapterdescription = db.Column(db.String(150), nullable=False, unique=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    subject = db.relationship('Subject', back_populates='chapters')
    quizzes = db.relationship('Quiz', back_populates='chapter', cascade='all, delete-orphan')


class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id'), nullable=False)
    date_of_quiz = db.Column(db.Date, nullable=False)
    time_duration = db.Column(db.Integer, nullable=False)
    chapter = db.relationship('Chapter', back_populates='quizzes')
    questions = db.relationship('Question', back_populates='quiz')
    scores = db.relationship('Score', back_populates='quiz')


class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'))
    title = db.Column(db.String, nullable=False)
    question_statement = db.Column(db.String, nullable=False)
    option1 = db.Column(db.String, nullable=False)
    option2 = db.Column(db.String, nullable=False)
    option3 = db.Column(db.String)
    option4 = db.Column(db.String)
    correct_option = db.Column(db.String(10), nullable=False)
    quiz = db.relationship('Quiz', back_populates='questions')


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'))  
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  
    time_stamp_of_attempt = db.Column(db.DateTime, default=datetime.utcnow)  
    total_scored = db.Column(db.Integer, nullable=False)
    quiz = db.relationship('Quiz', back_populates='scores')
    user = db.relationship('User', back_populates='scores')


