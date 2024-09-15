# JStatistics

Tech stack

Back-end
    Flask
    PostgreSQL
    SQLAlchemy
    JWT

Front-end
    React JS
    javascript
    mui
    HTML
    CSS
#################################
Running this app
#################################
- You'll need to have Docker, Docker compose

- Clone this repo and move into the directory
    . git clone https://github.com/Jamal-Ayman/newcorpo.git
    . cd newcorpo

- Build everything
    . docker compose up --build


- project will work http://127.0.0.1:3000

- this will open the login page

- Run "docker exec -it backend /bin/bash"

- Run "flask db upgrade"

- you will need to signup first by click on "
Don't have an account? Sign Up"

- or you can open http://127.0.0.1:3000/signup

- after signup you will login and redirected to the dashboard
####################################
Dashboard Explanation
####################################
- once login, you will redirected to dashboard

- every object linked to user who logged in authenticated with JWT

- dashboard has sidebar and navbar

- dashboard has widgets that show how many records uploaded in the two models
  dataset model (that receive CSV sheet), and image model (save images) and every 
  objects linked to the user

- quick action box to upload your sheet or image to related models

- sidebar has every pages needed to apply the requirenments
    . Dataset page
        - has upload button
        - search field by id
        - objects you uploaded and buttons to handle the featurs

    . Images page
        - same to datasets page but with different design    

- Text processing page
    . page take a text from user and do the below actions
        - summrize the text
        - extract keywords
        - analyze sentiment
        and every action in a button
- TSNE page
    . it will generate TSNE graph for the user after insert text
    ["test application to get best result.
    fix bugs to get best result"]

- Text analysis page
    . do the below actions
        - search
        - categorize
        - custome query

- Navbar: you can find Logout button and account info button

- from account info button you can check you username and email and you can
change both