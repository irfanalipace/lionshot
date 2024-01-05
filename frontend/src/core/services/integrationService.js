import ebayService from './ebayService';
import amazon from '../../assets/images/marketplaces/amazon.png';
import ebay from '../../assets/images/marketplaces/ebay.png';
import walmart from '../../assets/images/marketplaces/walmart.png';

export const appsKeysEnums = {
	ebay: 'ebay',
	amazon: 'amazon',
	walmart: 'walmart',
};

export const appsLogoEnums = {
	[appsKeysEnums.ebay]: ebay,
	[appsKeysEnums.amazon]: amazon,
	[appsKeysEnums.walmart]: walmart,
};

export const apps = {
	[appsKeysEnums.ebay]: {
		logo: ebay,
		name: 'Ebay',
		onIntegration: ebayService.init,
		loading: false,
	},
	[appsKeysEnums.amazon]: {
		logo: amazon,
		name: 'Amazon',
		loading: false,
		disabled: true,
	},
	[appsKeysEnums.walmart]: {
		logo: walmart,
		name: 'Walmart',
		loading: false,
		disabled: true,
	},
};

const integrationService = {
	init({ app, ...rest }) {
		if (typeof apps[app].onIntegration === 'function')
			apps[app].onIntegration(rest);
		else rest.callback();
	},
};

export default integrationService;
