# PARADOX — Case 001

An interactive detective mystery at Bellweather Museum. Run it locally with Node.js 20.9 or newer:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run build` for a production build and `npm start` to run it.

## Code to show your teacher

Open the `src` folder. The game code is grouped there:

- `src/app/page.tsx` — stores progress and handles player actions.
- `src/components/CaseContent.tsx` — displays the game screens and interactive controls.
- `src/data/case.ts` — holds the locations, clues, suspects, and deduction rules.
- `src/app/api/cases/[caseId]/accusation/route.ts` — checks the final accusation on the server.
- `src/app/globals.css` — controls the dark theme and responsive layout.
- `src/app/layout.tsx` — sets the page title and loads the styles.

### Simple explanation

The page keeps one progress object. Clicking a clue or answering a question updates it, and the browser saves it locally. The screen component reads that progress and displays the right part of the game. Case details live in one data file. The server route checks the final accusation without sending the solution to the browser.

## Project setup files

Keep `package.json`, `package-lock.json`, `tsconfig.json`, and `next.config.ts` in the project root. They tell npm and Next.js how to run the app. `node_modules` holds installed libraries; `.next` holds generated build files. You normally do not need to open either folder when explaining the game.

## Optional MongoDB

The game works without a database. To record accusation attempts in MongoDB Atlas, copy `.env.example` to `.env.local`, add `MONGODB_URI` and `MONGODB_DB`, then run `npm run seed`. Progress is saved in this browser; accounts and cross-device saves are not included.
