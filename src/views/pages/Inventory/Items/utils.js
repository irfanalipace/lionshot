export const mapObjectAccordingToPayload = object => {
	return {
		sku: object?.item_details.sku,
		mpn: object?.item_details.mpn,
		asin: object?.item_details.asin,
		title: object?.item_details.title,
		selling_price: object?.item_details.selling_price,
		cost: object?.item_details.cost,
		quantity: object?.item_details.quantity,
		description: object?.item_details.description,
		item_id: object?.item_details.item_id,
		business_price: 100,
		condition_id: object?.item_details.condition_id,
		market_place_id: object?.marketplace.market_place_ids[0],
		brand_id: object?.item_details.brand_id,
		category_id: object?.item_details.category_id,
		item_file: object?.item_images?.item_files,
		_method: object?._method,
	};
};

export const mapResponseAccordingToFormik = response => {
	return {
		id: response.id,
		item_details: {
			sku: response.sku,
			mpn: response.mpn,
			asin: response.asin,
			title: response.title,
			selling_price: response.selling_price,
			cost: response.cost,
			quantity: response.quantity,
			description: response.description,
			item_id: response.item_id,
			condition_id: response.condition_id,
			brand_id: response.brand_id,
			category_id: response.category_id,
		},
		marketplace: {
			market_place_ids: [response.market_place_id],
		},
		item_images: {
			item_files: response.item_images,
		},
	};
};

export const mapErrorAccordingToFormik = error => {
	return {
		item_details: {
			sku: error?.sku,
			mpn: error?.mpn,
			asin: error?.asin,
			title: error?.title,
			selling_price: error?.selling_price,
			cost: error?.cost,
			quantity: error?.quantity,
			description: error?.description,
			item_id: error?.item_id,
			condition_id: error?.condition_id,
			brand_id: error?.brand_id,
			category_id: error?.category_id,
		},
		item_images: {
			item_files: error?.item_file,
		},
	};
};
