import { LightningElement, api, track } from 'lwc';

export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api rates;

    initialized = false;

    amountInBaseCurrency;
    amountInQuoteCurrency;

    get ratesAsComboboxOptions(){
        return this.rates.map(rate => { return {'label':rate.code,'value':rate.code };});
    }

    get exchangeRate(){
        return (this.rates.find(rate => rate.code == this.selectedQuoteCurrency)).value;
    }

    recalculate(){
        if (!this.amountInQuoteCurrencyElement.value || !this.amountInBaseCurrency || !this.exchangeRate){
            console.log('empty params');
            return;
        }

        this.amountInQuoteCurrencyElement.value = this.exchangeRate * this.amountInBaseCurrency;
    }

    renderedCallback(){
        if (this.initialized === false && this.rates.length > 0){
            const randomIndex = Math.floor(Math.random() * this.rates.length);

            this.baseCurrencyElement.value = this.base;
            this.quoteCurrencyElement.value = this.rates[randomIndex].code;
            this.initialized = true;
        }

        this.recalculate();
    }

    //#region event handlers
    handleQuoteCurrencyAmountChange(){
        if (this.amountInQuoteCurrency === this.amountInQuoteCurrencyElement.value){
            // No changes has been done
            return;
        }
        this.amountInQuoteCurrency = this.amountInQuoteCurrencyElement.value;
        this.amountInBaseCurrencyElement.value = this.amountInQuoteCurrency / this.exchangeRate;
    }

    handleBaseCurrencyAmountChange(){
        if (this.amountInBaseCurrency === this.amountInBaseCurrencyElement.value){
            // No changes has been done
            return;
        }
        this.amountInBaseCurrency = this.amountInBaseCurrencyElement.value;
        this.amountInQuoteCurrencyElement.value = this.amountInBaseCurrencyElement.value * this.exchangeRate;
    }

    handleSelectedBaseCurrencyChange(){
        this.dispatchEvent(new CustomEvent('basechange', { detail: this.baseCurrencyElement.value }));
    }

    handleSelectedQuoteCurrencyChange(){
        this.recalculate();
    }
    //#endregion
   

    toPlainObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    get selectedQuoteCurrency(){
        return this.quoteCurrencyElement.value;
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