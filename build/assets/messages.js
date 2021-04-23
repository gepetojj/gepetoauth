"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messages = {
    invaliddata: "Há campos com erros que devem ser corrigidos.",
    invalidusername: "O campo 'usuário' está inválido.",
    usernamelength: "O campo 'usuário' deve ter entre 3 e 15 caracteres.",
    invalidpassword: "O campo 'senha' está inválido.",
    passwordlength: "O campo 'senha' deve ter entre 8 e 24 caracteres.",
    passwordrequires: "O campo 'senha' deve ter letras maiúsculas e minúsculas, números e caracteres especiais.",
    passwordequals: "Os campos 'senha' devem ser iguais.",
    invalidemail: "O campo 'email' está inválido.",
    invalidclientid: "O campo 'clientId' está inválido.",
    clientidlength: "O campo 'clientId' deve ter 14 números.",
    invalidredirecturl: "O campo 'redirectUrl' está inválido.",
    redirecturllength: "O campo 'redirectUrl' deve ter mais que 3 caracteres.",
    invalidtoken: "O campo 'token' está inválido.",
    expiredtoken: "O token informado está expirado.",
    tokenlength: "O campo 'token' deve ter 32 caracteres.",
    invalidcode: "O campo 'code' está inválido.",
    expiredcode: "O code informado está expirado.",
    codelength: "O campo 'code' deve ter 32 caracteres.",
    invalidorigin: "O autor deste pedido não está autorizado.",
    emailnotconfirmed: "O usuário deve confirmar o email para prosseguir.",
    userbanned: "O usuário está banido.",
    tokenrevoked: "O token foi desativado com sucesso.",
    authorized: "Autorizado com sucesso.",
    validtoken: "O token está válido.",
    genericerror: "Houve um erro interno.",
    databaseerror: "Houve um erro com o banco de dados.",
};
// ERROR CODE PATTERN:
// where error is happening / which field / what is wrong
var errorCodes = {
    invaliddata: "BODY/INVALIDDATA",
    invalidusername: "BODY/USERNAME",
    usernamelength: "BODY/USERNAME/LENGTH",
    invalidpassword: "BODY/PASSWORD",
    passwordlength: "BODY/PASSWORD/LENGTH",
    passwordrequires: "BODY/PASSWORD/REQUIREMENTS",
    passwordequals: "BODY/PASSWORD/EQUALS",
    invalidemail: "BODY/EMAIL",
    invalidclientid: "BODY/CLIENTID",
    clientidlength: "BODY/CLIENTID/LENGTH",
    invalidredirecturl: "BODY/REDIRECTURL",
    redirecturllength: "BODY/REDIRECTURL/LENGTH",
    invalidtoken: "BODY/TOKEN",
    expiredtoken: "BODY/TOKEN/EXPIRED",
    tokenlength: "BODY/TOKEN/LENGTH",
    invalidcode: "BODY/CODE",
    expiredcode: "BODY/CODE/EXPIRED",
    codelength: "BODY/CODE/LENGTH",
    invalidorigin: "REQUEST/ORIGIN",
    emailnotconfirmed: "USER/EMAIL/NOTCONFIRMED",
    userbanned: "USER/BANNED",
    tokenrevoked: "",
    authorized: "",
    validtoken: "",
    genericerror: "ERROR/GENERIC",
    databaseerror: "ERROR/DATABASE",
};
function message(code) {
    return { message: messages[code], error: errorCodes[code] };
}
exports.default = message;
