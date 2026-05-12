"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const mongoose_1 = require("mongoose");
const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({
                message: `${paramName} must be a non-empty string`
            });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: `Invalid ${paramName} format`
            });
            return;
        }
        next();
    };
};
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=validation.js.map