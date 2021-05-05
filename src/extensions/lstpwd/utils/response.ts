import { Codes, GAResponse } from "../../../utils/types";
import {
	errorCodes as originalErrors,
	messages as originalMessages,
} from "../../../utils/response";

export interface Messages extends Codes {
	invalidservice: string;
	invalidicon: string;

	passwordcreated: string;
	passworddeleted: string;
	yourpasswords: string;
}

export const messages: Messages = {
	...originalMessages,
	invalidservice: "O campo 'serviço' está inválido",
	invalidicon: "O campo 'icon' está inválido.",
	passwordcreated: "Sua senha foi salva com sucesso.",
	passworddeleted: "Sua senha foi deletada com sucesso.",
	yourpasswords: "Suas senhas salvas listadas.",
};

export const errorCodes: Messages = {
	...originalErrors,
	invalidservice: "BODY/SERVICE",
	invalidicon: "BODY/ICON",
	passwordcreated: "",
	passworddeleted: "",
	yourpasswords: "",
};

export function response(
	error: boolean,
	message: keyof Messages,
	extras?: object
) {
	const response: GAResponse = {
		error: error === false ? [error] : [error, errorCodes[message]],
		message: messages[message],
		...extras,
	};
	return response;
}
