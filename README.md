# aurelia-gpt
The Aurelia 2 codebase in queryable form using GPT.

## Askaurelia

This codebase powers askaurelia.com - where you can ask questions about the Aurelia 2 codebase. Because the codebase contains source files and documentation, you can ask questions about the codebase itself and also the docs. To keep costs low, there are limits on the number of questions you can ask per day and you need to signin using GitHub. Currently this is 25 queries per day.

Try the app here: https://askaurelia.com

## Self-hosted

If you want to host your own version of AskAurelia, there are a few things.

In `backend` create a new file called `.env` based on the `.env.example` file. Make sure you provide the needed GitHub oAuth details, your OpenAI API key and defined query limit per 24 hours.

Make sure you `npm install` dependencies in both `backend` and `frontend` directories.

Run the backend server with `npm start` in the `backend` directory. The front-end can be run by running `npm start` in the `frontend` directory (make sure the backend is running). Login using the normal application flow via GitHub.