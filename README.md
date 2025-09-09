# Quiz-master-v2
# Overview
Quiz-Master is an application designed for users, where the admin plays a crucial role. It allows users to browse and search for quizzes and subjects, take quizzes within a time limit, track progress, view scores, and analyze performance. Users can also visualize subject-wise quizzes and month-wise attempted quizzes using bar and pie charts. The admin manages quizzes, subjects, and users, sets quiz rules, time limits, and dates, monitors user activity, and generates reports on subject-wise top scores and subject-wise user attempts.
# Features
For Users:
 - Browse and search quizzes.
 - Take quizzes with a time limit etc.
 - Track progress, view scores, and analyze performance.
 - Visualize quiz activity with bar and pie charts.

For Admin:
 - Manage quizzes, subjects, and users.
 - Set quiz rules, time limits, and formats.
 - Monitor user activity and generate reports.
# Technologies Used
 - Frontend: Vue.js (via CDN), Bootstrap for responsive UI.
 - Backend: Flask with Flask-Security for authentication.
 - Database: SQLite3.
 - Task Queue: Celery with Redis for background task handling.
 - Email & Other Tools: Mailhog for testing email functionalities and Chart.js for visualizations.
# Setup Instructions
Prerequisites:
 - Flask and other required dependencies (requirements.txt)
 - Python 3.8+ installed
 - Redis server installed and running
 - Mailhog installed for testing email functionalities

Installation:
1. Clone the repository:
  ````  
git clone <repository-url>
    
cd <repository-url>
````
2. Create a Virtual Environment:
````
python -m venv virtual_environment_name
````
3. Activate the Virtual Environment:
````
virtual_environment_name\Scripts\activate
````
4. Install dependencies:
````
pip install -r requirements.txt
````
5. Run the python application:
````
python app.py
````
6. Start Redis Server:
````
sudo service redis-server start
redis-server
````
7. Start Celery Worker:
````
celery -A app.celery worker -l info
````
8. Start Celery Beat Scheduler:
````
celery -A app.celery beat --max-interval 1 -l info
````
9. Start Mailhog for Email Testing:
````
mailhog
````
