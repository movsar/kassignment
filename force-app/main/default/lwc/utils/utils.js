import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';


const LocalSettings = {
    currencyOrderSettingsName: `currencyOrderSettings${Id}`,

    incrementCurrencyOrder: function (currencyCode) {
        console.log('incrementCurrencyOrder');

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

export { LocalSettings };