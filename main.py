from flask import Flask, render_template, send_file

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def index():
    return render_template('index.html')

# example: serve a generated resume or file
@app.route('/download-resume')
def download_resume():
    # return send_file('static/resume/Abhinav_Resume.pdf', as_attachment=True)
    return "Resume endpoint - implement send_file when you have a file"

if __name__ == '__main__':
    app.run(debug=True)