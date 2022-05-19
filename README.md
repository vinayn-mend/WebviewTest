## Prerequisites

- [Node](https://nodejs.org) v10 (it is recommended to install it via [NVM](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/)
- A development machine set up for React Native by following [these instructions](https://facebook.github.io/react-native/docs/getting-started.html)

## Getting Started

1. Clone this repo
2. Go to project's root directory, `cd <your project name>`
3. Run `yarn` to install dependencies
4. Go to ios folder, `cd ios` and run `pod install`
5. Return to root foler and start the packager with `yarn start`
6. On a new terminal tab run `yarn ios` to open ios simulator. Make sure Xcode is installed.
7. To inspect ios app, open safari and click develop option from top menu there you can inspect the webview from the connected/opened simulator.
8. Enjoy!!!

- Edit App.js to make changes
- On iOS:
  - Open `ios/YourReactProject.xcworkspace` in Xcode
  - Hit `Run` after selecting the desired device to run on device. Make sure you turned on WEb insepctor option from Settings->Safari->Advanced->Web Inspector On
