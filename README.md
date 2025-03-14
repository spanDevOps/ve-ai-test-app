# VE.AI Test App

Simple React application to test custom domain implementation. This app displays workspace information and helps verify that our custom domain setup is working correctly.

## Features
- Shows current workspace ID
- Displays current domain
- Updates in real-time
- Clean, modern UI

## Setup
1. Create a new GitHub repository named "ve-ai-test-app"
2. Push this code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm start
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_WORKSPACE_ID=test-workspace
```

## Deployment
This app is designed to be deployed to AWS Amplify to test our custom domain implementation.
