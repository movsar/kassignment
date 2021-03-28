import { LightningElement, api, track } from 'lwc';
import { LocalSettings } from 'c/utils';
export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api quote;
    @api rates;

    initialized = false;
    baseCurrencyHasChanged = false;

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
                this.reCalculateFromBaseToQuote(this.rates, this.quoteCurrency, this.amountInBaseCurrency);
            }
        }

        if (this.baseCurrencyHasChanged === true){
            this.baseCurrencyHasChanged = false;
            // TODO: Change to a better approach
            setTimeout(() => {
                this.reCalculateFromBaseToQuote(this.rates, this.quoteCurrency, this.amountInBaseCurrency);
            }, 500);
        }
    }

    reCalculateFromQuoteToBase(rates, quoteCurrency, amountInQuoteCurrency){
        if (!rates || !amountInQuoteCurrency || !quoteCurrency){
            console.error('reCalculateFromQuoteToBase: Incorrect Input');
            return;
        }

        const exchangeRate = rates.find(rate => rate.code == quoteCurrency).value;
        this.amountInBaseCurrency = parseFloat((amountInQuoteCurrency / exchangeRate).toFixed(3));
    }

    @api
    reCalculateFromBaseToQuote(rates, quoteCurrency, amountInBaseCurrency){
        if (!rates || !amountInBaseCurrency || !quoteCurrency){
            console.error('reCalculateFromQuoteToBase: Incorrect Input');
            return;
        }

        const exchangeRate = rates.find(rate => rate.code == quoteCurrency).value;
        this.amountInQuoteCurrency = parseFloat((amountInBaseCurrency * exchangeRate).toFixed(3));
    }

    //#region event handlers
    handleQuoteCurrencyAmountChange() {
        if (this.amountInQuoteCurrency === this.amountInQuoteCurrencyElement.value) {
            return;
        }
        this.amountInQuoteCurrency = parseFloat(this.amountInQuoteCurrencyElement.value);

        this.reCalculateFromQuoteToBase(this.rates, this.quoteCurrency, this.amountInQuoteCurrency);
    }

    handleBaseCurrencyAmountChange() {
        if (this.amountInBaseCurrency === this.amountInBaseCurrencyElement.value) {
            return;
        }
        this.amountInBaseCurrency = parseFloat(this.amountInBaseCurrencyElement.value);

        this.reCalculateFromBaseToQuote(this.rates, this.quoteCurrency, this.amountInBaseCurrency);
    }

    handleSelectedBaseCurrencyChange() {
        if (this.quoteCurrency === this.baseCurrencyElement.value) {
            this.quoteCurrency = this.baseCurrency;
            this.dispatchEvent(new CustomEvent('quotechange', { detail: this.quoteCurrency }));
        }
        
        this.baseCurrencyHasChanged = true;
        this.baseCurrency = this.baseCurrencyElement.value;
        LocalSettings.incrementCurrencyOrder(this.baseCurrency);
        this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
    }

    handleSelectedQuoteCurrencyChange() {
        if (this.quoteCurrencyElement.value === this.baseCurrency) {
            this.baseCurrency = this.quoteCurrency;
            this.baseCurrencyHasChanged = true;
            this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
        }

        this.quoteCurrency = this.quoteCurrencyElement.value;
        this.dispatchEvent(new CustomEvent('quotechange', { detail: this.quoteCurrency }));
        this.reCalculateFromBaseToQuote(this.rates, this.quoteCurrency, this.amountInBaseCurrency);   
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