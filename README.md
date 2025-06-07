# 🌟 Personal Portfolio & Blog Website

A modern, professional portfolio website built for software engineers specializing in full-stack development. Features a comprehensive blog system with threaded comments, portfolio showcase, and clean responsive design with dark/light theme support.

## ✨ Features

### 🎨 **Modern Design**
- Clean, minimalist interface with professional aesthetics
- Fully responsive design that works on all devices
- Dark/Light theme toggle with smooth transitions
- Custom CSS variables for consistent theming

### 📝 **Blog System**
- Individual blog post pages with rich content rendering
- Blog listing with search and category filtering
- Threaded comment system with likes and replies
- Related posts suggestions
- SEO-friendly URLs and meta information

### 💼 **Portfolio Showcase**
- Project filtering by category (Frontend, Backend, Full-Stack, Mobile)
- Interactive project cards with live demos and GitHub links
- Skills and technologies display
- Professional experience timeline

### 🚀 **Performance & Developer Experience**
- Built with Vite for lightning-fast development
- TypeScript for type safety and better developer experience
- Component-based architecture following React best practices
- Custom hooks for state management and business logic

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS v4 with custom CSS variables
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Development:** ESLint, TypeScript, Hot Module Replacement

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── comments/        # Comment system components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # UI components (ThemeToggle, etc.)
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── data/                # Static data (blog posts, projects)
├── styles/              # Global styles and Tailwind config
└── utils/               # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/budhilaw/minimalist-frontend.git
   cd minimalist-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the website.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🎯 Key Features Breakdown

### **Comment System Architecture**
The comment system follows React best practices with complete separation of concerns:

- **`useComments` Hook** - Manages all comment state and business logic
- **`CommentSection`** - Main orchestrator component
- **`CommentForm`** - Reusable form for comments and replies
- **`CommentItem`** - Individual comment display with threading support

### **Theme System**
- CSS custom properties for consistent theming
- Automatic system preference detection
- Persistent theme selection using localStorage
- Smooth transitions between themes

### **Blog Content Rendering**
- Markdown-like content parsing
- Syntax highlighting for code blocks
- Responsive typography and spacing
- SEO-optimized meta tags

## 🌐 Customization

### **Personal Information**
Update your personal information in:
- `src/data/personalInfo.ts` - Contact details and social links
- `src/data/blogPosts.ts` - Blog content
- `src/data/projects.ts` - Portfolio projects

### **Styling**
- Modify `src/styles/index.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize CSS variables for colors and spacing

### **Content**
- Add new blog posts in `src/data/blogPosts.ts`
- Update project portfolio in `src/data/projects.ts`
- Modify about section content in respective components

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1024px+) - Full layout with sidebar navigation
- **Tablet** (768px-1023px) - Adapted layout with touch-friendly interface
- **Mobile** (320px-767px) - Mobile-first design with hamburger menu

## 🔧 Development Best Practices

### **Component Architecture**
- Single Responsibility Principle
- Reusable and composable components
- Proper TypeScript interfaces
- Custom hooks for business logic

### **State Management**
- React hooks for local state
- Custom hooks for complex logic
- Props drilling avoided through proper component composition

### **Code Quality**
- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Well-documented component interfaces

## 🚀 Deployment

The website can be deployed to various platforms:

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and configure build settings
3. Deploy with zero configuration

### **Netlify**
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

### **GitHub Pages**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 🤝 Contributing

While this is a personal portfolio, contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ericsson Budhilaw**
- Portfolio: [budhilaw.com](https://budhilaw.com)
- LinkedIn: [linkedin.com/in/budhilaw](https://www.linkedin.com/in/budhilaw/)
- GitHub: [github.com/budhilaw](https://github.com/budhilaw)
- Email: ericsson@budhilaw.com

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for amazing developer experience
- Styled with [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- Icons from [Lucide](https://lucide.dev/) for beautiful, consistent iconography
- Inspired by modern portfolio designs and best practices in web development

---

⭐ **If you found this project helpful, please give it a star!** ⭐
