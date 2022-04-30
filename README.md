# midiParser
MUST Capstone Project: HardChord

Project Details
Backend: Python - Flask
Frontend: Javascript - React

Run Instructions:
1. Clone repo
2. If there is an existing venv folder, delete it
3. Open powershell/command prompt in midiParser folder
4. Ensure computer has Python 3.8.10 installed by running python --version
5. Run python -m venv venv
6. Run venv\Scripts\activate if on Windows, source venv/bin/activate on Mac. This will activate the virtual environment, seen with (venv) before all prompt lines
7. Run pip install flask flask_restful flask_cors music21 pychord
8. Test that backend is functioning by running flask run
9. Backend should be running on port 5000
10. Once backend is functional, leave flask running and move to frontend in a different terminal window
11. From midiParser folder, navigate to midi-frontend folder
12. In midi-frontend folder, run npm install
13. Run npm start. Frontend should be running on port 3000.
14. Generate some chords! You earned it.

If there are any problems in running this repo, please contact your local HardChord representative.
