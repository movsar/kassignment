import { LightningElement, api, track } from 'lwc';

export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api rates;
    @track selectedQuoteCurrency;
    @track amountInQuoteCurrency;

    initialized = false;

    get ratesAsComboboxOptions(){
        return this.rates.map(rate => { return {'label':rate.code,'value':rate.code };});
    }

    get exchangeRate(){
        return (this.rates.find(rate => rate.code == this.selectedQuoteCurrency)).value;
    }

    calculate(){
        this.amountInQuoteCurrency = this.exchangeRate * this.amountInQuoteCurrency;
    }

    renderedCallback(){
        if (this.initialized === false && this.rates.length > 0){
            const randomIndex = Math.floor(Math.random() * this.rates.length);
            this.selectedQuoteCurrency = this.rates[randomIndex].code;

            this.baseCurrencyElement.value = this.base;
            this.quoteCurrencyElement.value = this.selectedQuoteCurrency;
        }
    }

    //#region event handlers
    handleBaseCurrencyAmountChange(){
        console.log(this.amountInBaseCurrencyElement.value);
        console.log(this.amountInQuoteCurrencyElement.value);

        const amountAfterConversion = this.amountInBaseCurrencyElement.value * this.exchangeRate;
        this.amountInQuoteCurrencyElement.value = amountAfterConversion;

        this.calculate();
    }

    handleSelectedBaseCurrencyChange(){
        const selectedBaseCurrency = this.baseCurrencyElement.value;
        this.dispatchEvent(new CustomEvent('basechange', { detail: selectedBaseCurrency }));

        this.calculate();
    }
    handleSelectedQuoteCurrencyChange(){
        this.selectedQuoteCurrency = this.quoteCurrencyElement.value;

        this.calculate();
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