import { LightningElement, api, track } from 'lwc';
import { LocalSettings, Constants } from 'c/utils';
export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api quote;
    @api rates;

    initialized = false;

    baseCurrency;
    amountInBaseCurrency;

    quoteCurrency;
    amountInQuoteCurrency;

    renderedCallback() {
        if (this.quote && this.base){
            this.baseCurrency = this.base;
            this.quoteCurrency = this.quote;

            if (this.initialized === false && this.rates.length > 0) {
                this.amountInBaseCurrency = 1;
                this.initialized = true;
                
                this.reCalculate(this.rates, Constants.BASE_TO_QUOTE);
            }
        }
    }

    @api
    reCalculate(rates, direction, quoteCurrency){
        if (quoteCurrency){
            this.quoteCurrency = quoteCurrency;
        }

        if (!rates || !this.quoteCurrency || !direction){
            console.error('recalculate: Incorrect Input');
            return;
        }

        const exchangeRate = rates.find(rate => rate.code == this.quoteCurrency).value;

        if (direction === Constants.BASE_TO_QUOTE){
            this.amountInQuoteCurrency = parseFloat((this.amountInBaseCurrency * exchangeRate).toFixed(3));
        }

        if (direction === Constants.QUOTE_TO_BASE){
            this.amountInBaseCurrency = parseFloat((this.amountInQuoteCurrency / exchangeRate).toFixed(3));
        }
    }

    //#region event handlers
    handleQuoteCurrencyAmountChange() {
        if (this.amountInQuoteCurrency === this.amountInQuoteCurrencyElement.value) {
            return;
        }
        this.amountInQuoteCurrency = parseFloat(this.amountInQuoteCurrencyElement.value);

        this.reCalculate(this.rates, Constants.QUOTE_TO_BASE);
    }

    handleBaseCurrencyAmountChange() {
        if (this.amountInBaseCurrency === this.amountInBaseCurrencyElement.value) {
            return;
        }
        this.amountInBaseCurrency = parseFloat(this.amountInBaseCurrencyElement.value);

        this.reCalculate(this.rates, Constants.BASE_TO_QUOTE);
    }

    handleSelectedBaseCurrencyChange() {
        if (this.quoteCurrency === this.baseCurrencyElement.value) {
            this.quoteCurrency = this.baseCurrency;
            this.dispatchEvent(new CustomEvent('quotechange', { detail: this.quoteCurrency }));
        }
        
        this.baseCurrency = this.baseCurrencyElement.value;
        LocalSettings.incrementCurrencyOrder(this.baseCurrency);
        this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
    }

    handleSelectedQuoteCurrencyChange() {
        if (this.quoteCurrencyElement.value === this.baseCurrency) {
            this.baseCurrency = this.quoteCurrency;
            this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
        }

        this.quoteCurrency = this.quoteCurrencyElement.value;
        this.dispatchEvent(new CustomEvent('quotechange', { detail: this.quoteCurrency }));
        this.reCalculate(this.rates, Constants.BASE_TO_QUOTE);
    }
    //#endregion

    toPlainObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    get ratesAsComboboxOptions() {
        return this.rates.map(rate => { return { 'label': rate.code, 'value': rate.code }; });
    }

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