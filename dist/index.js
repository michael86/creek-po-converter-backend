"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //load env variabls first
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./db/config"));
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const pdf_1 = __importDefault(require("./routes/pdf"));
const purchaseOrders_1 = __importDefault(require("./routes/purchaseOrders"));
const locations_1 = __importDefault(require("./routes/locations"));
const prefixes_1 = __importDefault(require("./routes/prefixes"));
const deliveries_1 = __importDefault(require("./routes/deliveries"));
const manage_1 = __importDefault(require("./routes/manage"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3000;
config_1.default
    .getConnection()
    .then((conn) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected successfully!");
}))
    .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
});
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/auth", auth_1.default);
app.use("/pdf", auth_2.validateMe, pdf_1.default);
app.use("/purchase-order", auth_2.validateMe, purchaseOrders_1.default);
app.use("/locations", auth_2.validateMe, locations_1.default);
app.use("/prefix", auth_2.validateMe, prefixes_1.default);
app.use("/deliveries", auth_2.validateMe, deliveries_1.default);
app.use("/manage", auth_2.validateMe, manage_1.default);
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log("App started, listening on port", PORT);
    });
}
exports.default = app;
