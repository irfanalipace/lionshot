## IMS

This is the root for a Monorepo Project create in React projects using Vite. The project utilizes Node.js version
18.16 and leverages several popular packages to facilitate development,
including Vite, Material-UI, Redux Toolkit, Axios, Lodash, and more.

## Getting Started

Before running the application, make sure you have **Node.js version 18.16** and **pnpm version 8.6.12**
installed on your machine. If you don't have it, you can download and install it
from the official Node.js website.

Install pnpm using **npm install -g pnpm**,

To set up the project, follow these steps:

## Running the project

First Run **pnpm install --frozen-lock**:Installs the dependencies in all the packages and apps in monorepo without updating the FrozenLock file

Then Run **pnpm run build:package** : Builds the Invoicing package located at packages/invoicing<br/>

Then navigate to **apps/IMS**

## Setting the Environment

Instructions: Create a .env File to the apps/IMS directory

Add the following environment variables to the env file:'

#REACT VARIABLES<br/>
VITE_APP_ENVIRONMENT=development<br/>
VITE_APP_URL=http://localhost:5173<br/>

#Default URL for API requests<br/>
VITE_APP_API_BASE_URL=http://localhost:8000/api<br/>

#EBAY CREDENTIALS<br/>
VITE_APP_EBAY_CLIENT_ID='TAKE_CREDENTIALS_FROM_TEAM_LEAD'<br/>
VITE_APP_EBAY_CLIENT_SECRET='TAKE_CREDENTIALS_FROM_TEAM_LEAD'<br/>
VITE_APP_EBAY_REDIRECT_URI='TAKE_CREDENTIALS_FROM_TEAM_LEAD'<br/>

#SQUARE CREDENTIALS<br/>
VITE_APP_SQUARE_APPLICATION_ID=TAKE_CREDENTIALS_FROM_TEAM_LEAD<br/>
VITE_APP_SQUARE_LOCATION_ID=TAKE_CREDENTIALS_FROM_TEAM_LEAD<br/>

Then Run **pnpm run dev**: Starts the development server using Vite, enabling hot module
replacement and fast development setup.<br/>


## Other Available Scripts in IMS Application

**pnpm run build**: Creates the production-ready optimized bundle of IMS application in /dist folder<br/>
**pnpm run lint**: Lints the project
using ESLint, detecting and reporting any potential code issues.<br/>
**pnpm run preview**: Serves the production build of the application locally for preview.

## Available Scripts in Root

In the project directory, you can use the following scripts:

**pnpm run build:package** : Builds the Invoicing package located at packages/invoicing<br/>
**pnpm run build:app** : Builds the production-ready optimized bundle of IMS application using Vite located at apps/IMS<br/>
**pnpm run build:all** : Builds the package first and the create
production-ready optimized bundle of IMS application using Vite.<br/>

