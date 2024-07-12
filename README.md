# GSW-frontend

Frontend website that pulls from the groundstation database stored on the same raspberry pi as this server is running on. Planning on this being a simple nodejs server that presents the data in the database with some graphs.
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running the Website

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using the Website

1. Choose the type of data (imu/sun/battery) and date range of data. 
2. Click "Fetch Data" (NOTE: Click this every time you change the parameters, the displays do not update automatically).

