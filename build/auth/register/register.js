"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var response_1 = __importDefault(require("../../assets/response"));
var router = express_1.Router();
var schema = {
    username: {
        in: ["body"],
        errorMessage: "O campo username está inválido.",
        isString: true,
        toLowerCase: true,
        isLowercase: true,
        escape: true,
        isLength: {
            errorMessage: "O campo username deve ter mais de 3 caracteres e até 15.",
            options: {
                min: 3,
                max: 15,
            },
        },
    },
    email: {
        in: ["body"],
        errorMessage: "O campo email está inválido.",
        isString: true,
        toLowerCase: true,
        isLowercase: true,
        escape: true,
        isEmail: {
            errorMessage: "O campo email deve ser um email.",
        },
    },
    password: {
        in: ["body"],
        errorMessage: "O campo password está inválido.",
        isString: true,
        isStrongPassword: {
            errorMessage: "O campo password deve ter letras, números e caracteres especiais.",
            options: {
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                minUppercase: 1,
            },
        },
        isLength: {
            errorMessage: "O campo password deve ter mais de 8 caracteres e até 24.",
            options: {
                min: 8,
                max: 24,
            },
        },
    },
    passwordConfirmation: {
        in: ["body"],
        errorMessage: "O campo passwordConfirmation está inválido.",
        isString: true,
        isStrongPassword: {
            errorMessage: "O campo passwordConfirmation deve ter letras, números e caracteres especiais.",
            options: {
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                minUppercase: 1,
            },
        },
        isLength: {
            errorMessage: "O campo passwordConfirmation deve ter mais de 8 caracteres e até 24.",
            options: {
                min: 8,
                max: 24,
            },
        },
    },
};
router.post("/", express_validator_1.checkSchema(schema), function (req, res) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(response_1.default(true, "Houveram erros que devem ser corrigidos.", "INVALIDDATA", { errors: errors.array() }));
    }
    var _a = req.body, username = _a.username, email = _a.email, password = _a.password, passwordConfirmation = _a.passwordConfirmation;
    if (password !== passwordConfirmation) {
        return res
            .status(400)
            .json(response_1.default(true, "Os campos de senha devem ser iguais.", "PASSWORDSDOESNTMATCH"));
    }
});
exports.default = router;
