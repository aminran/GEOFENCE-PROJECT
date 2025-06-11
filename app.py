from flask import Flask, render_template, request
from flask_mail import Mail, Message

app = Flask(__name__)

# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = 'itdecoder3@gmail.com'
# app.config['MAIL_PASSWORD'] = 'ewrmorujljrmwlna'

# mail = Mail(app)

@app.route('/')
def index():
    return render_template('geofence.html')


if __name__ == "__main__":
    app.run(debug=False)