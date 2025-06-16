"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const locations_1 = require("../controllers/locations");
const locations_2 = require("../middleware/locations");
const router = (0, express_1.Router)();
router.post("/update", locations_2.validateLocationUpdate, locations_1.updateLocation);
router.get("/", locations_1.fetchAllLocations);
exports.default = router;
