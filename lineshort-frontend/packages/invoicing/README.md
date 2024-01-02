# IMS PACKAGE

## Getting Started

Before running the application, make sure you have **Node.js version 18.16** and **pnpm version 8.6.12**
installed on your machine. If you don't have it, you can download and install it
from the official Node.js website.

To set up the project, follow these steps:

## ENV

Instructions: Adding an env.local File to the Invoice Package Directory

Navigate to the directory where the invoice package is located.

Create a new file named **env.local** within this directory.

Open the env.local file in a text editor of your choice.

Add the following environment variables to the env.local file:'

## Example Environment Variables
VITE_AUTH_TOKEN='Your Auth Token'
VITE_BASE_URL='Backend Server Url'

## Available Scripts

In the project directory, you can use the following scripts:

**pnpm run dev**: Starts the development server using Vite, enabling hot module
replacement and fast development setup.<br/>
**pnpm run build**: Builds the
production-ready optimized bundle using Vite.<br/>
**pnpm run lint**: Lints the project
using ESLint, detecting and reporting any potential code issues.<br/>
**pnpm run preview**: Serves the production build of the application locally for preview.
