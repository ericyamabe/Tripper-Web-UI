# Tripper-Web-UI


## Starting the Development Environnent

### Build Docker image: 

These are all done in the command line in the Tripper API folder.

```
% docker-compose build
```
Run the container:

```
% docker compose up -d
```

Stop the Container:

```
% docker compose stop
```

### Checking to make sure it is working

In your web browser, go to:

http://localhost/

and you should see the Tripper dashboard


## Committing to this repo

### Proper steps to commit to the repo using GIT commands

Also please take a look at https://git-scm.com/docs/gittutorial

#### From the main branch, make sure you are up to date

```
% git pull origin main
```

#### Create new branch using "checkout" and the -b flag to denote new branch

```
% git checkout -b <ticket number>
```

Example, if my ticket was TRIP-1

```
% git checkout -b TRIP-1
```

#### Adding code and checking commit status

Check your branch status and look for files to be added

```
% git status
```

Add the files that need to be committed

```
% git add <filename>
% git add <filename>
```

You can use this to add everything, but be sure you want to add everything

```
% git add .
```

#### Committing your changes

When you commit your changes, you need to first add a commit message.  In the message, please start with the JIRA ticket number. Example using ticket TRIP-1

```
% git commit -m "TRIP-1 this is my commit message"
```

#### Update your branch with main, and push changes to your branch

```
% git pull origin main
% git push origin <branch name>
```

Example:

```
% git pull origin main
% git push origin TRIP-1
```

#### Creating a github pull request for peer review

Go to github.com, in the Tripper-Web-UI project, select the tab "Pull Request".  Click "Create Pull Request".  The base will be "stage", and the compare will be your branch.  The main and stage branch has been locked and not commits can be done directly to it.  Chances are, Github will recognized you pushed changes to your develoment branch, and you will see a message that your branch has some changes, and will ask if you want to "Compare & pull request".  You can use this to create your pull request.  Please make sure the base is set to "stage".  We will build this branch first to test against, before pushing to main, which is considered the production branch.
