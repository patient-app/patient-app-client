# Patient App Client

##  How to run

1. Install nodejs 22.14.0 -> when typing `node -v` in the terminal, the output should be `v22.14.0`
2. `npm install`
3. `npm run dev`

## Environment Variables

- In the frontend there are ususally no secrets (as all of the code is sent to the client anyways)
- To add a new environment variable, add it to the `.env` file and to the `.env.production.main` and `.env.production.production` files
- When building the docker image, the environment variables from the `.env.production.main` and `.env.production.production` files are automatically added to the built image

## Main and Production Environments

###  Main Environment

- The "main" environment shows the latest changes on the main branch
- <https://patient-app-main.jonas-blum.ch/>

###  Production Environment

- The "production" environment shows the latest changes on the production branch
- <https://patient-app-production.jonas-blum.ch/>

## Pre-Commit Hooks (currently not setup in this repo -> see therapist-app if you want this)

- Automatically formats your code before every commit
- on Github actions the code formatting is also checked -> so either you need to do it manually or automatically whenever you are committing code

1. `npm install`
2. `npm run prepare`
3. Now whenver you commit code, it will be formatted automatically

## Workflow: How to implement an issue

1. Look at the issue number and create a new branch (from main) with the name `issueNumber-issue-title` (e.g. `5-create-login-register-endpoint`)
2. Do some changes and add your first commit
3. As soon as you added the first commit, push the branch (so other team member are aware of your work and can already see if any problems might arise -> if everyone just codes by themselves the collaboration is usually a lot worse)
4. Create a pull request from your branch to main
5. Add the issue number to the pull request title (e.g. `5: Create login/register endpoint`)
6. In the description of the pull request, add `-closes #5` to automatically close the issue when the pull request is merged
7. Assign the pull request to yourself
8. After applying the file formatting take a look at the changes of the pull request in Github under "Files changed" to see that everything is correct
9. If everything is correct, merge the pull request with the option "Squash and merge" (so we have a nice history with one commit per issue -> otherwise the commit history is bloated with commits)
10. (Optional) If you cannot merge your branch into main due to a conflict do the following steps:

- `git checkout main`
- `git pull` (or `git reset --hard origin/main` if you have some local changes)
- `git checkout YOUR-BRANCH` (e.g. `5-create-login-register-endpoint`)
- `git rebase -i main`
- Solve the conflicts with the help of your IDE
- Do a force push of your branch `git push -f`
- Now the conflicts should be solved and you can merge your branch into main through Github (with the option "Squash and merge")
