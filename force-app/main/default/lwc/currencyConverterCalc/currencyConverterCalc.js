import { LightningElement, api, track } from 'lwc';

export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api rates;

    initialized = false;

    baseCurrency;
    amountInBaseCurrency;

    quoteCurrency;
    amountInQuoteCurrency;

    get ratesAsComboboxOptions(){
        return this.rates.map(rate => { return {'label':rate.code,'value':rate.code };});
    }

    get exchangeRate(){
        return (this.rates.find(rate => rate.code == this.quoteCurrency)).value;
    }

    recalculate(){
        if (!this.amountInBaseCurrency || !this.exchangeRate){
            console.error('empty params');
            return;
        }

        this.amountInQuoteCurrency = this.exchangeRate * this.amountInBaseCurrency;
    }

    renderedCallback(){
        if (this.initialized === false && this.rates.length > 0){
            // Initialize form controls
            this.baseCurrency = this.base;
            this.quoteCurrency = 'RUB';
            this.amountInBaseCurrency = 1;
            this.initialized = true;
        }

        this.recalculate();
    }

    //#region event handlers
    handleQuoteCurrencyAmountChange(){
        if (this.amountInQuoteCurrency === this.amountInQuoteCurrencyElement.value){
            return;
        }
        this.amountInQuoteCurrency = this.amountInQuoteCurrencyElement.value;

        this.amountInBaseCurrency = this.amountInQuoteCurrency / this.exchangeRate;
    }

    handleBaseCurrencyAmountChange(){
        if (this.amountInBaseCurrency === this.amountInBaseCurrencyElement.value){
            return;
        }
        this.amountInBaseCurrency = this.amountInBaseCurrencyElement.value;

        this.amountInQuoteCurrency = this.amountInBaseCurrency * this.exchangeRate;
    }

    handleSelectedBaseCurrencyChange(){
        if (this.quoteCurrency === this.baseCurrencyElement.value){
            this.quoteCurrency = this.baseCurrency;
        }
        this.baseCurrency = this.baseCurrencyElement.value;
        
        this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
    }

    handleSelectedQuoteCurrencyChange(){
        if (this.baseCurrency === this.quoteCurrencyElement.value){
            this.baseCurrency = this.quoteCurrency;
            this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrency }));
        }
        this.quoteCurrency = this.quoteCurrencyElement.value;

        this.recalculate();
    }
    //#endregion
   
    toPlainObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    // #region html refs
    get quoteCurrencyElement(){
        return this.template.querySelector('[data-id=selectedQuoteCurrency]');
    }

    get baseCurrencyElement(){
        return this.template.querySelector('[data-id=selectedBaseCurrency]');
    }

    get amountInBaseCurrencyElement(){
        return this.template.querySelector('[data-id=amountInBaseCurrency]');
    }

    get amountInQuoteCurrencyElement(){
        return this.template.querySelector('[data-id=amountInQuoteCurrency]');
    }
    // #endregion
}