import { LightningElement, api, track } from 'lwc';
import { LocalSettings, Utils, Constants } from 'c/utils';
export default class CurrencyConverterCalc extends LightningElement {
    @api baseCurrency;
    @api quoteCurrency;
    @api rates;

    amountInBaseCurrency = 1;
    amountInQuoteCurrency;

    get ratesAsComboboxOptions() {
        return this.rates.map(rate => { return { 'label': rate.code, 'value': rate.code }; });
    }

    @api
    reCalculate(rates, direction, quoteCurrency){
        console.log(JSON.parse(JSON.stringify(rates)));
        if (quoteCurrency){
            this.quoteCurrency = quoteCurrency;
        }

        if (!rates || !this.quoteCurrency || !direction){
            console.error('recalculate: Incorrect Input');
            return;
        }

       // rates = Utils.calculateRates(this.baseCurrency);
       // Utils.logAsPlainObject(rates);
        const exchangeRate = rates.find(rate => rate.code == this.quoteCurrency).value;

        if (direction === Constants.BASE_TO_QUOTE){
            this.amountInQuoteCurrency = parseFloat((this.amountInBaseCurrency * exchangeRate).toFixed(3));
        }

        if (direction === Constants.QUOTE_TO_BASE){
            this.amountInBaseCurrency = parseFloat((this.amountInQuoteCurrency / exchangeRate).toFixed(3));
        }
    }

    //#region event handlers
    quoteCurrencyAmountChangeHandler() {
        if (this.amountInQuoteCurrency === this.amountInQuoteCurrencyElement.value) {
            return;
        }

        this.amountInQuoteCurrency = parseFloat(this.amountInQuoteCurrencyElement.value);
        this.reCalculate(this.rates, Constants.QUOTE_TO_BASE);
    }

    baseCurrencyAmountChangeHandler() {
        if (this.amountInBaseCurrency === this.amountInBaseCurrencyElement.value) {
            return;
        }

        this.amountInBaseCurrency = parseFloat(this.amountInBaseCurrencyElement.value);
        this.reCalculate(this.rates, Constants.BASE_TO_QUOTE);
    }

    baseCurrencyChangeHandler() {
        this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrencyElement.value }));
    }

    quoteCurrencyChangeHandler() {
        this.dispatchEvent(new CustomEvent('quotechange', { detail: this.quoteCurrencyElement.value }));
    }
    //#endregion

    // #region html refs
    get quoteCurrencyElement() {
        return this.template.querySelector('[data-id=selectedQuoteCurrency]');
    }

    get baseCurrencyElement() {
        return this.template.querySelector('[data-id=selectedBaseCurrency]');
    }

    get amountInBaseCurrencyElement() {
        return this.template.querySelector('[data-id=amountInBaseCurrency]');
    }

    get amountInQuoteCurrencyElement() {
        return this.template.querySelector('[data-id=amountInQuoteCurrency]');
    }
    // #endregion
}