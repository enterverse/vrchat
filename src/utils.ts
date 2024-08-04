export const reduceQueryObject = <T extends object>(query: T) => {
	return Object.keys(query)
		.map((key) => `${key}=${query[key as keyof T]}`)
		.join("&");
};

export const atLeastOneOf = <T extends object>(
	object: T,
	keys: Array<keyof T>
) => {
	const atleastOne = keys.some((key) => object[key] !== undefined);

	if (!atleastOne) {
		throw new Error(
			`At least one of the following keys must be provided: ${keys.join(", ")}`
		);
	}

	return object;
};
