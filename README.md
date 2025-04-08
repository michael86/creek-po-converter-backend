# creek-po-converter-backend

Back end for [Creek PO Converter](<[docs/CONTRIBUTING.md](https://github.com/michael86/creek-po-converter/tree/main)>).

A simple CRUD API for interacting with a sql database storing information from purchase orders and allowing users to view, and update the status on parts being delivered.

## Tech used

1. NodeJS
2. Express
3. MySQL

## Middleware

1. [Express-validator](https://www.npmjs.com/package/express-validator) to validate and sanitize data received from the client
2. [MySQL](https://www.npmjs.com/package/mysql)
3. Custom built logging system for each users interaction
4. Custom built one time use token authentification system that will delete and generate a new user token after each query.

## API Endpoints

| Method | Endpoint                     | Description                                                                                     | Auth Required |
| ------ | ---------------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| POST   | `/user/login`                | logs in the user                                                                                | No            |
| POST   | `/user/register`             | Registers a new user                                                                            | No            |
| GET    | `/auth/me`                   | validates a users JWT                                                                           | yes           |
| POST   | `/pdf/upload`                | Accepts a pdf file attached as an upload and attempts to insert the parsed data to the database | Yes           |
| DELETE | `/purchase-order/delete/:id` | Deletes a purchase order                                                                        | Yes           |
| GET    | `/purchase-order/names`      | Returnsd a list of purchase order names                                                         | Yes           |
| PUT    | `/:uuid/items/:partNumber`   | updates a specific purchase orders item with a location                                         | Yes           |
| GET    | `/:uuid`                     | returns a specific purchase order along with history                                            | Yes           |
| GET    | `/locations`                 | returns an array of locations with their id                                                     | Yes           |
