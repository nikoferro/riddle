## On-Chain riddle

This repo includes all the components for the zama.ai coding challenge.

### Services

#### Client + API

The client is a Next.js application that allows users to interact with the deployed smart contract. It displays the riddle / question and enables users to submit answers, as well as view previously submitted ones.

It includes an endpoint that acts as a proxy for interacting with the subgraph.

#### Subgraph

The subgraph indexes events emitted by the smart contract, making it easy to interact with data related to each riddle. It also decodes tx data for the transaction that emits `AnswerAttempt` in order to index the attempted answer. This is because the event itself does not include this information.

#### Bot

A small TypeScript bot that uses wagmi to listen for contract events. Once a winner is detected and a riddle is solved, it publishes a new riddle from a predefined list.

#### Hardhat

The Hardhat folder includes the smart contract, a script to fork Sepolia locally, and a deployment script.

### Design considerations and choices

#### Client + API

I chose Next.js for both familiarity and its built-in support for server-side rendering and API routes, removing the need to develop a separate web server.

Initially, I considered indexing the data myself instead of using a subgraph, so having API routes support built-in was helpful. It still proved useful when I decided to proxy requests to the subgraph through an API route.

For state management, I used React Context, as it was sufficient to share state across components without unnecessary prop drilling.

#### Subgraph

I considered building my own indexer, but since this was a coding challenge and time was limited, I opted to deploy a subgraph. It offered built-in features like replay, block reordering handling, and data indexing. Otherwise, I would have had to handle multiple edge cases related to blockchain data and deploy a database for this use case.

#### Bot

Created a small bot which includes a JSON file containing riddles and answers. Its purpose is to monitor contract events and publish a new riddle once one is solved. I used viem instead of ethers because its a robust library that supports alternative Ethereum methods depending on RPC capabilities

### Limitations and missing features

- The client while it does include the basic manifest that comes with a basic Next.js project bootstrapping, does not include all the icons / metadata to support a nice looking bookmark on mobile devices. There is also no SEO related configuration.

- When opening multiple clients in parallel, the clients do listen to contract events to stop the submission of answers in case there is a winner for the current riddle, but this could be more robust, and also the client should listen to attempted answers also to "live-update" this list

- All the data is available to build a leaderboard, but considered this out of scope of this challenge

- The bot while it does check when starting if there is an active riddle, it doesnt include a recovery mechanism in case there is an exception/service goes down. Also while its not stateful, since it uses a JSON to track what should be the next riddle, its not ready for the hipotetical case that it should need to scale horizontally

![image_alt](https://github.com/nikoferro/riddle/blob/3e0a408653771017012692a944870fcb44a021b6/screenshot.png?raw=true)
