# Contributing to Sound Blog

First off, thank you for considering contributing to Sound Blog! Contributions from the community help make this project better for everyone.

## What You Can Contribute

We are looking for a variety of contributions, including but not limited to:

- **🐞 Bug Fixes:** Notice something broken? Open an issue or submit a PR to fix it!
- **✨ New Features:** Have a great idea for a new feature? We'd love to hear it and see your implementation.
- **📝 Documentation:** Improvements to the README, inline comments, or adding new documentation files are always welcome.
- **🎨 UI/UX Enhancements:** Suggestions for improving the design, accessibility, and user experience.
- **🛠️ Refactoring & Performance:** Code cleanup, performance improvements, and resolving technical debt.

## How to Contribute

### 1. Report an Issue

If you've noticed a bug or have a feature request, make sure to check our **Issues** page to see if someone else in the community has already created a ticket. If not, go ahead and create a new issue detailing the problem or your idea.

### 2. Open a Pull Request (PR)

Ready to write some code? Here is the step-by-step process for opening a Pull Request:

1. **Fork the repository** to your own GitHub account.
2. **Clone the project** to your local machine:
   ```bash
   git clone https://github.com/Shatlyk1011/sound-blog.git
   cd sound-blog
   ```
3. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
   _(For bug fixes, you might name it `fix/issue-description`)_
4. **Make your changes** in your code editor.
5. **Commit your changes** clearly. We recommend using conventional commits:
   ```bash
   git commit -m 'feat: add some feature'
   ```
6. **Push the branch** to your forked repository:
   ```bash
   git push origin feature/my-awesome-feature
   ```
7. **Open a Pull Request** against the `main` branch of this repository.

### PR Guidelines

- **Describe your changes:** In your PR description, clearly explain what the PR does and why it is needed. Mention any related issues (e.g., "Closes #123").
- **Keep it focused:** Try to keep your PR focused on a single feature or bug fix. This makes it much easier to review and merge.
- **Follow coding standards:** Ensure your code follows the existing formatting. We use ESLint and Prettier.

## Local Development Setup

To get started with local development, follow these steps:

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Set up environment variables:**
   Copy the example environment file and fill in your details:
   ```bash
   cp .env.example .env
   ```
3. **Run the development server:**
   ```bash
   pnpm dev
   ```
4. **Open your browser** at `http://localhost:3000` to see the app running.

---

Thank you again for your interest in contributing to Sound Blog! 🎙️
