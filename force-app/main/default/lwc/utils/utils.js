import Id from '@salesforce/user/Id';

const Utils = {
    gbpRates: [],
    calculateRates: function (baseCurrency) {
        if (!baseCurrency){
            console.error('calculateRates: base currency is empty');
            return;
        }
        let ratesForNewBaseCurrency = [];
        for (let i = 0; i < this.gbpRates.length; i++) {
            let newBaseRateInGbp = this.gbpRates.find(rate => rate.code === baseCurrency);
            let newRate = {};
            newRate.code = this.gbpRates[i].code;
            newRate.value = this.gbpRates[i].value / newBaseRateInGbp.value;
            newRate.order = LocalSettings.getCurrencyOrder(newRate.code);
            ratesForNewBaseCurrency.push(newRate);
        }

        // Sort by usage frequency
        ratesForNewBaseCurrency = ratesForNewBaseCurrency.sort((a, b) => (a.order > b.order) ? -1 : ((a.order < b.order) ? 1 : 0));
        
        return ratesForNewBaseCurrency;
    },
    toPlainObject: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    logAsPlainObject: function (obj) {
        console.log('# logAsPlainObject #');
        console.log(this.toPlainObject(obj));
    },
    getCurrentDateTime: function () {
        return (new Date()).toLocaleString();
    },
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
}

const Constants = {
    QUOTE_TO_BASE: 'QUOTE_TO_BASE',
    BASE_TO_QUOTE: 'BASE_TO_QUOTE'
}

const LocalSettings = {
    currencyOrderSettingsName: `currencyOrderSettings${Id}`,

    incrementCurrencyOrder: function (currencyCode) {
        const currencySettingsStr = localStorage.getItem(this.currencyOrderSettingsName);
        let currencyOrderSettings;

        if (!currencySettingsStr) {
            currencyOrderSettings = {};
        } else {
            currencyOrderSettings = JSON.parse(currencySettingsStr);
        }

        let previousValue = (currencyOrderSettings[currencyCode]) ? currencyOrderSettings[currencyCode] : 0;
        currencyOrderSettings[currencyCode] = ++previousValue;

        localStorage.setItem(this.currencyOrderSettingsName, JSON.stringify(currencyOrderSettings));
    },

    getCurrencyOrder: function (currencyCode) {
        const currencySettingsStr = localStorage.getItem(this.currencyOrderSettingsName);
        if (!currencySettingsStr) {
            return 0;
        }
        const currencyOrderSettings = JSON.parse(currencySettingsStr);
        return currencyOrderSettings[currencyCode] ? currencyOrderSettings[currencyCode] : 0;
    }
}

export { LocalSettings, Constants, Utils };