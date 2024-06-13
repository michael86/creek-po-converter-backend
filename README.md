# creek-po-converter-backend
Back end for [Creek PO Converter]([docs/CONTRIBUTING.md](https://github.com/michael86/creek-po-converter/tree/main)). 

A simple CRUD API for interacting with a sql database storing information from purchase orders and allowing users to view, and update the status on parts being delivered. 

## Middleware

1. [Express-validator](https://www.npmjs.com/package/express-validator) to validate and sanitize data received from the client
2. [MySQL](https://www.npmjs.com/package/mysql)
3. Custom built logging system for each users interaction
4. Custom built one time use token authentification system that will delete and generate a new user token after each query.
