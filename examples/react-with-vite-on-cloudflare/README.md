# React with Vite on Cloudflare Pages

# Getting started

## Install and authenticate

```bash
# npm
npm install -g wrangler

# yarn
yarn global add wrangler
```

## Set up Project
```bash
# Clone the template
npx digit toyamarinyon/cloudflare-pages-plugin-trpc/examples/react-with-vite-on-cloudflare

cd react-with-vite-on-cloudflare

# Install dependencies
npm install
```

## Create your database
```bash
wrangler d1 create DB
```

## Create table
wrangler d1 execute DB --local --file=./schema.query

## Run
npm run dev
