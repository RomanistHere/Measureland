import { fetchFunction } from "./api.js";
import { API_URL } from "../../configs/env.js";

const translateText = async (text, lang) => {
	const url = `${API_URL}/external/translate_text`;

	// text can be array
	// POST because you can't send array of strings in get - if user uses commas,
	// we won't be able to recognize array items correctly
	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			text,
			lang,
		}),
	});
};

export {
	translateText,
};
