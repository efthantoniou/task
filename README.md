#README.MD

# Instructions

# Requirements
  Docker installed in your environment

# SetUp
  1. In the root directory run 'docker compose build'. If its needed run 'docker compose build --no-cache'
  2. Run 'docker compose up -d'
  3. 'cd backend && chmod +x setup_database.sh'
  4. Run to create the database './setup_database.sh' if any issue arises from this command can get in the container and connect to mysql and create the database and table as it's described in 'setup_database.sh'
  5. Go to http://localhost:3000 The index page is empty but on the top right is the routes to the pages.
  
