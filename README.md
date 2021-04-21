# ninja-coder <img src="./public/logo.png" height="25px"></img>

Become a real Ninja Coder using this training application!

<table>
        <tr>
            <td><img width="60" src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/beaker.svg" alt="hackday" /></td>
            <td><strong>Archived Repository</strong>
                <br />
                The code of this repository was written during several <strong>dack days</strong> by <a href="https://marmelab.com/en/jobs">Marmelab developers</a>. It's part of the distributed R&D effort at Marmelab, where each developer spends 2 days a month for learning and experimentation.
                <br />
                <strong>This code is not intended to be used in production, and is not maintained.</strong>
            </td>
        </tr>
</table>

## How It Works

> Before starting your journey, you must be well prepared physically and mentally. We do not assume any responsibility resulting from this Ninja training.

1. Launch the website and let the application use your camera
2. Start the Ninja mode
3. Code using your body
4. Run it

If it works, then you are a Ninja Coder 🎉.
If not, practice again in front of a mirror, and come back.

**Tips**: When a pose is recognised, the symbol will be written in the terminal next to the webcam, or directly executed. If you see nothing... try again 😉.

Here is a quick help:

<img src="./public/moves.png" height="300px"></img>

**Tips**: Put your efforts into style. The more you look like a real Ninja, the more likely you are to become a real Ninja Coder.

## Technical Aspects

This application is based on the detection of poses a human can perform with his body.

We trained a machine to detect several poses, using [Teachable Machine](https://teachablemachine.withgoogle.com/), a Google AI project. Each pose corresponds to a JavaScript keyword, or group of keywords, or an action (start the detection, run the code).

### Setup & Development

**Tip:** Type `make help` to see all the available commands.

This repository is based on [Yarn](https://yarnpkg.com). Be sure to install it first.

#### First Installation

Install all dependencies with `make install`.

#### Run Development Server

Start the development server with `make run`. The website is available at [localhost:3000](http://localhost:3000/).

### Languages

The application is written in [React](https://reactjs.org/), and built using [Vite](https://vitejs.dev/).

### Architecture

The architecture is quite simple:

> - src/
>   - code/
>       - Code.jsx
>       - Letter.jsx
>       - symbolsJS
>   - pose/
>       - PosePredictor.jsx
>       - Webcam.jsx
>   - App.jsx
>   - NinjaContext.jsx

The poses are:

1. Centralized using a React context: `<NinjaContextProvider>`
2. Captured by the `useWebcam` hook (file `Webcam.jsx`)
3. Detected by the `usePredictions` hook (file `PosePredictor.jsx`)
4. Translated to JavaScript in the `<Code>` component or directly executed,
   using the `translate` method (file `translateToJS.js`).

### Customizing The Models

The models can be found inside the `public/models` folder.

You can train your own model using [Teachable Machine](https://teachablemachine.withgoogle.com/).

All you have to do is to create one different pose by JavaScript keyword, group of keywords, or by action (see the `symbols.js` file).

```js
// In src/code/symbols.js

export const SYNTAX_DOT = 'DOT'; // .
export const SYNTAX_LEFT_BRACKET = 'LEFT_BRACKET'; // (
export const SYNTAX_RIGHT_BRACKET = 'RIGHT_BRACKET'; // )
export const SYNTAX_SEMICOLON = 'SEMICOLON'; // ;
export const SYNTAX_STRING = 'STRING'; // '
```

And load them in the Ninja context using the props `modelPath` and `metadataPath`.

```js
function App() {
    return (
        <NinjaContextProvider
            modelPath="models/v3/model.json"
            metadataPath="models/v3/metadata.json"
        >
            <div>My App</div>
        </NinjaContextProvider>
    );
}
```

**Tips**: You can also add your own poses by:

1. Declaring them in the `symbols.js` file
2. Translating them to JavaScript instructions in the `translateToJs.js` file

```js
// In src/code/symbols.js

export const SYNTAX_ALERT = 'ALERT';

// In src/code/translateToJS.js

export function translateOneIntruction(instruction) {
    switch (instruction) {
        case SYNTAX_ALERT:
            return 'alert';
        default:
            return '';
    }
};
```

#### Tests

Not tested 🙃 It's an experiment! 👨‍🔬

### Build & Deployment

Generate the static website under the public directory with `make build`.
