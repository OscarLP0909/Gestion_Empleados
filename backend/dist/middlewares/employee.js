"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNif = validateNif;
function validateNif(req, res, next) {
    const nif = req.body?.nif ?? req.params?.nif;
    if (!nif) {
        res.status(400).json({ error: "El NIF es requerido" });
        return;
    }
    if (!isValidNif(nif)) {
        res.status(400).json({ error: "El formato del NIF no es válido" });
        return;
    }
    next();
}
function isValidNif(nif) {
    if (typeof nif !== "string") {
        return false;
    }
    const cleanNif = nif.toUpperCase().trim();
    // NIE: X, Y o Z seguido de 7 números y 1 letra
    if (/^[XYZ]\d{7}[A-Z]$/.test(cleanNif)) {
        const nieNumber = cleanNif.replace("X", "0").replace("Y", "1").replace("Z", "2");
        return checkControlLetter(nieNumber);
    }
    // NIF de persona física: 8 números y 1 letra
    if (/^\d{8}[A-Z]$/.test(cleanNif)) {
        return checkControlLetter(cleanNif);
    }
    // NIF de persona jurídica: letra inicial + 7 números + dígito/letra de control
    if (/^[A-HJNPQRSUVW]\d{7}[0-9A-Z]$/.test(cleanNif)) {
        return checkCompanyControlDigit(cleanNif);
    }
    return false;
}
const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKEO";
function checkControlLetter(nif) {
    const numbers = nif.substring(0, nif.length - 1);
    const letter = nif.charAt(nif.length - 1);
    const calculatedLetter = NIF_LETTERS.charAt(parseInt(numbers, 10) % 23);
    return letter === calculatedLetter;
}
function checkCompanyControlDigit(nif) {
    const digits = nif.substring(1, 8);
    const controlChar = nif.charAt(8);
    const sum = parseInt(digits.charAt(0)) * 2 +
        parseInt(digits.charAt(1)) * 4 +
        parseInt(digits.charAt(2)) * 8 +
        parseInt(digits.charAt(3)) * 5 +
        parseInt(digits.charAt(4)) * 10 +
        parseInt(digits.charAt(5)) * 9 +
        parseInt(digits.charAt(6)) * 7 +
        parseInt(digits.charAt(7)) * 3;
    const remainder = 11 - (sum % 11);
    let calculatedControl;
    if (remainder === 10) {
        calculatedControl = "J";
    }
    else if (remainder === 11) {
        calculatedControl = "0";
    }
    else {
        calculatedControl = remainder.toString();
    }
    return controlChar === calculatedControl;
}
//# sourceMappingURL=employee.js.map