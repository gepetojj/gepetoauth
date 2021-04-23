import { GAResponse, Codes } from "./types";

export const messages: Codes = {
	invaliddata: "Há campos com erros que devem ser corrigidos.",
	invalidusername: "O campo 'usuário' está inválido.",
	usernamelength: "O campo 'usuário' deve ter entre 3 e 15 caracteres.",
	invalidpassword: "O campo 'senha' está inválido.",
	passwordlength: "O campo 'senha' deve ter entre 8 e 24 caracteres.",
	passwordrequires:
		"O campo 'senha' deve ter letras maiúsculas e minúsculas, números e caracteres especiais.",
	passwordequals: "Os campos 'senha' devem ser iguais.",
	invalidemail: "O campo 'email' está inválido.",
	useroremailexists: "O usuário ou email informados já existem",
	invalidclientid: "O campo 'clientId' está inválido.",
	clientidlength: "O campo 'clientId' deve ter 14 números.",
	invalidredirecturl: "O campo 'redirectUrl' está inválido.",
	redirecturllength: "O campo 'redirectUrl' deve ter mais que 3 caracteres.",
	invalidrtoken: "O campo 'refresh_token' está inválido.",
	expiredrtoken: "O refresh_token informado está expirado.",
	rtokenlength: "O campo 'refresh_token' deve ter 32 caracteres.",
	invalidatoken: "O campo 'access_token' está inválido.",
	expiredatoken: "O access_token informado está expirado.",
	atokenlength: "O campo 'access_token' deve ter 32 caracteres.",
	invalidcode: "O campo 'code' está inválido.",
	expiredcode: "O code informado está expirado.",
	codelength: "O campo 'code' deve ter 32 caracteres.",
	invalidorigin: "O autor deste pedido não está autorizado.",
	invalidstate: "O campo 'state' está inválido.",
	emailnotconfirmed: "O usuário deve confirmar o email para prosseguir.",
	userbanned: "O usuário está banido.",
	tokenrevoked: "O token foi desativado com sucesso.",
	authorized: "Autorizado com sucesso.",
	validtoken: "O token está válido.",
	usercreated: "Usuário criado com sucesso.",
	genericerror: "Houve um erro interno.",
	databaseerror: "Houve um erro com o banco de dados.",
};

// ERROR CODE PATTERN:
// where error is happening / which field / what is wrong

export const errorCodes: Codes = {
	invaliddata: "BODY/INVALIDDATA",
	invalidusername: "BODY/USERNAME",
	usernamelength: "BODY/USERNAME/LENGTH",
	invalidpassword: "BODY/PASSWORD",
	passwordlength: "BODY/PASSWORD/LENGTH",
	passwordrequires: "BODY/PASSWORD/REQUIREMENTS",
	passwordequals: "BODY/PASSWORD/EQUALS",
	invalidemail: "BODY/EMAIL",
	useroremailexists: "BODY/USERNAMEOREMAIL",
	invalidclientid: "QUERY/CLIENTID",
	clientidlength: "QUERY/CLIENTID/LENGTH",
	invalidredirecturl: "QUERY/REDIRECTURL",
	redirecturllength: "QUERY/REDIRECTURL/LENGTH",
	invalidrtoken: "QUERY/REFRESH_TOKEN",
	expiredrtoken: "QUERY/REFRESH_TOKEN/EXPIRED",
	rtokenlength: "QUERY/REFRESH_TOKEN/LENGTH",
	invalidatoken: "QUERY/ACCESS_TOKEN",
	expiredatoken: "QUERY/ACCESS_TOKEN/EXPIRED",
	atokenlength: "QUERY/ACCESS_TOKEN/LENGTH",
	invalidcode: "BODY/CODE",
	expiredcode: "BODY/CODE/EXPIRED",
	codelength: "BODY/CODE/LENGTH",
	invalidorigin: "REQUEST/ORIGIN",
	invalidstate: "QUERY/STATE",
	emailnotconfirmed: "USER/EMAIL/NOTCONFIRMED",
	userbanned: "USER/BANNED",
	tokenrevoked: "",
	authorized: "",
	validtoken: "",
	usercreated: "",
	genericerror: "ERROR/GENERIC",
	databaseerror: "ERROR/DATABASE",
};

export default function response(
	error: boolean,
	message: keyof Codes,
	extras?: object
) {
	const response: GAResponse = {
		error: error === false ? [error] : [error, errorCodes[message]],
		message: messages[message],
		...extras,
	};
	return response;
}
