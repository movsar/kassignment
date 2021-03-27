import { LightningElement, api, track } from 'lwc';

export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api rates;

    initialized = false;
    baseCurrencyHasChanged = false;

    baseCurrency;
    amountInBaseCurrency;

    quoteCurrency;
    amountInQuoteCurrency;

    renderedCallback() {
        if (this.initialized === false && this.rates.length > 0) {
            // Initialize form controls
            this.baseCurrency = this.base;
            this.quoteCurrency = 'RUB';
            this.amountInBaseCurrency = 1;
            this.initialized = true;
            this.reCalculateFromBaseToQuote();
        }

        if (this.baseCurrencyHasChanged === true){
            this.baseCurrencyHasChanged = false;
            this.reCalculateFromBaseToQuote();
        }
    }

    reCalculateFromQuoteToBase(){
        this.amountInBaseCurrency = parseFloat((this.amountInQuoteCurrency / this.exchangeRate).toFixed(3));
    }

    reCalculateFromBaseToQuote(){
        this.amountInQuoteCurrency = parseFloat((this.amountInBaseCurrency * this.exchangeRate).toFixed(3));
    }

    //#region event handlers
    handleQuoteCurrencyAmountChange() {
        if (this.amountInQuoteCurrency === this.amountInQuoteCurrencyElement.value) {
            return;
        }
        this.amountInQuoteCurrency = parseFloat(this.amountInQuoteCurrencyElement.value);

        this.reCalculateFromQuoteToBase();
    }

    handleBaseCurrencyAmountChange() {
        if (this.amountInBaseCurrency === this.amountInBaseCurrencyElement.value) {
            return;
        }
        this.amountInBaseCurrency = parseFloat(this.amountInBaseCurrencyElement.value);
        
        this.reCalculateFromBaseToQuote();
    }


    handleSelectedBaseCurrencyChange() {
        if (this.quoteCurrency === this.baseCurrencyElement.value) {
            this.quoteCurrency = this.baseCurrency;
        }
        
        this.baseCurrencyHasChanged = true;
        this.baseCurrency = this.baseCurrencyElement.value;
        this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
    }

    handleSelectedQuoteCurrencyChange() {
        if (this.quoteCurrencyElement.value === this.baseCurrency) {
            this.baseCurrency = this.quoteCurrency;
            this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
        }

        this.quoteCurrency = this.quoteCurrencyElement.value;
        this.reCalculateFromBaseToQuote();
    }
    //#endregion

    toPlainObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    get ratesAsComboboxOptions() {
        return this.rates.map(rate => { return { 'label': rate.code, 'value': rate.code }; });
    }

    get exchangeRate() {
        return (this.rates.find(rate => rate.code == this.quoteCurrency)).value;
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