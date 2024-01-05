const ebayService = {
  clientId: import.meta.env.VITE_APP_EBAY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_APP_EBAY_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_APP_EBAY_REDIRECT_URI,
  init({ callback }) {
    ebayService.startIntegrationProcess();
    if (typeof callback === 'function') callback();
  },
  startIntegrationProcess() {
    const baseURL = 'https://auth.ebay.com/oauth2/authorize';

    const queryParams = {
      client_id: ebayService.clientId,
      client_secret: ebayService.clientSecret,
      response_type: 'code',
      redirect_uri: ebayService.redirectUri,
      scope:
        'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly'
    };

    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const requestUrl = `${baseURL}?${queryString}`;

    // Redirect the user to the eBay login page to grant permission
    window.open(requestUrl);
  }
};

export default ebayService;
