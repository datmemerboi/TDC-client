TDC Client
=
The front end system to interact with the TDC API([repo](https://github.com/datmemerboi/TDC)). Entire system is built on React (with Next JS).

**Note:** Even though all modules are completed & working, this project is still in a very rough state. Refactor & modifications will be done very soon.

## Pages
- Patient
- Treatment
- Calendar
- Invoice
- Management

## Installation
This repo does not contain any releases as production builds from React do not support localhost proxy. The main goal of this app is to run locally with the TDC API.

### Running API locally
If the TDC API is running locally and the front end is to run locally as well, use the command:

```
npm i && npm run local
```

**Note:** If you are using Windows, you can run the command `npm run local_windows`.

### Running API remotely
To install all packages and run the server, use the command:

```
npm i && npm start
```
