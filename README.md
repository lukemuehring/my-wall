# Overview - MyWall

# How to run locally
## 1. Start Sanity server
Sanity provides a hosted backend for your text content and assets called the Content Lake.
Sanity has two parts:
    Sanity Studio — the content editing app (built with React)
    Sanity Content Lake — the cloud database where your content lives

Your Studio is just a front-end web app that talks to the Content Lake.

`cd sanity`
`npm i` if you haven't already
`npm run dev` to start sanity development server

The dev server live-reloads your Studio as you edit schemas.
It also lets you preview how your custom components and schema changes behave before deploying.
(https://www.sanity.io/docs/studio/development for more)

## 2. Run Next.js front end 
`cd dashboard`
`npm i` if you haven't already
`npm run dev` for hot reloading and running as development environment (detailed errors)
or
`npm run start` for production environment (no hot reloading, minified code, behaves like how a real app would on the server)

This command will also start the Next.js Router server to listen on server-side endpoints (found in src/app/api)
NOTE: you will have to configure the API token by creating a local `.env.local` file with SANITY_API_TOKEN=key_here so the Sanity client runs properly.





# todo
implement boards

When you deploy your Next.js app, you’ll also need to add your production domain (e.g. https://myapp.vercel.app) to sanity CORS origins.

small bugs:
opening the menu causes a slight layout shift
