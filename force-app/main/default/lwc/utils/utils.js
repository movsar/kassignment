import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';

const Utils = {
    ratesForGbp,
    calculateRates: function(baseCurrency){
        realBaseCurrency = 'GBP';
        ratesForNewBaseCurrency = [];
        for (let i = 0; i < this.ratesForGbp.length; i++){
            newBaseGbpExchangeRate = this.ratesForGbp.find(rate => rate.code === baseCurrency).value;
            let gbpRate = ratesForGbp[i];
            let newRate = Object.assign(newRate, rate);
            newRate.value = gbpRate.value / newBaseGbpExchangeRate;
            ratesForNewBaseCurrency.push(newRate);
        }

        return ratesForNewBaseCurrency;
    },
    toPlainObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    logAsPlainObject: function(obj){
        console.log('# logAsPlainObject #');
        console.log(this.toPlainObject(obj));
    },
    getCurrentDateTime: function() {
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