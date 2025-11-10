# Bmsventouse.fr

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Soofmaax/bmsventouse.fr/CI?label=CI&style=flat-square)
![Netlify Status](https://img.shields.io/netlify/your-netlify-id?label=Netlify&style=flat-square)

## Project Description

Bmsventouse.fr is a web application designed to provide information and services related to ventousage (suction) for various events and productions in France. The platform offers a comprehensive range of resources, including authorizations for public domain usage, logistics, security services, and contact information for various locations. 

### Key Features
- Detailed information on ventousage services across multiple regions in France.
- Contact forms for inquiries and service requests.
- Markdown content for easy updates and management of information.
- Responsive design for accessibility on various devices.

## Tech Stack

| Technology      | Description                                |
|------------------|--------------------------------------------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Markup language for structuring content. |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)   | Style sheet language for presentation.   |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Programming language for interactive features. |
| ![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown&logoColor=white) | Lightweight markup language for formatting text. |
| ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white) | Platform for hosting static websites. |

## Installation Instructions

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- A package manager like npm or yarn

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Soofmaax/bmsventouse.fr.git
   cd bmsventouse.fr
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables if needed. Create a `.env` file in the root directory and configure your environment variables as required by your application.

## Usage

To run the project locally, you can use a simple HTTP server. If you have `http-server` installed globally, you can run:

```bash
npx http-server
```

Open your browser and navigate to `http://localhost:8080` to view the application.

### Basic Usage Example
- Access the homepage at `index.html` for an overview of services.
- Navigate to specific sections like `contact/index.html` for inquiries or `ventousage/index.html` for detailed service descriptions.

## Project Structure

The project structure is organized as follows:

```
bmsventouse.fr/
├── .github/                    # GitHub workflows for CI/CD
│   └── workflows/
│       ├── bing-submit.yml     # Workflow for Bing submission
│       ├── ci.yml              # Continuous Integration workflow
│       ├── codeql.yml          # Code scanning workflow
│       └── indexnow.yml        # Workflow for IndexNow submission
├── affichage-riverains/        # Page for displaying riverain information
│   └── index.html
├── autorisation-occupation-domaine-public-tournage-paris/ # Authorization page
│   └── index.html
├── contact/                    # Contact page
│   └── index.html
├── contenu_markdown/           # Markdown content for various sections
│   ├── accueil.md
│   ├── autorisation-occupation-domaine-public-tournage-paris.md
│   ├── contact.md
│   ├── definition-ventousage.md
│   ├── logistique-seine-et-marne.md
│   ├── logistique-seine-saint-denis.md
│   ├── logistique-val-d-oise.md
│   ├── mentions.md
│   ├── realisations.md
│   ├── securite-tournage-strasbourg.md
│   ├── services.md
│   ├── transport-materiel-audiovisuel-paris.md
│   ├── ventousage-cinema.md
│   ├── ventousage-pantin.md
│   └── ventousage-paris.md
├── css/                        # Stylesheets
│   ├── faq.css
│   └── style.css
├── js/                         # JavaScript files
│   └── script.js
├── images/                     # Image assets
│   ├── contact-hero-background-desktop.webp
│   ├── contact-hero-background-mobile.webp
│   ├── logo-conseil-regional.svg
│   ├── logo-jo2024.svg
│   └── logo-netflix.svg
└── index.html                 # Main entry point for the application
```

### Main Files
- **index.html**: The main entry point for the web application.
- **package.json**: Contains project metadata and dependencies.
- **netlify.toml**: Configuration file for deploying on Netlify.
- **sitemap.xml**: Sitemap for SEO optimization.

## Contributing

We welcome contributions to improve the project! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch and submit a pull request.

Thank you for your interest in contributing to Bmsventouse.fr!
