import { LightningElement, track } from 'lwc';

export default class CurrencyConverter extends LightningElement {
    base = 'USD';
    @track rates = [];
    initialized = false;
    lastRefreshDateTime;

    baseChangeHandler(e) {
        this.base = e.detail;
        this.retrieveData();
    }

    getCurrentDateTime() {
        return (new Date()).toLocaleString();
    }

    retrieveData() {
        fetch(`https://api.exchangeratesapi.io/latest?base=${this.base}`)
            .then(response => response.json())
            .then(data => {
                this.rates = Object.keys(data.rates).map(key => {
                    return { 'code': key, 'value': data.rates[key] };
                });
                this.lastRefreshDateTime = this.getCurrentDateTime();

                setTimeout(() => {
                    this.currencyConverterCalc.reCalculateFromBaseToQuote();
                    this.currencyConverterList.showCurrentPageRates();
                }, 500);
            })
            .catch(error => console.error(error));
    }
    currencyConverterCalc;

    renderedCallback() {
        if (this.initialized === false) {
            this.initialized = true;
            this.currencyConverterCalc = this.template.querySelector("c-currency-converter-calc");
            this.currencyConverterList = this.template.querySelector("c-currency-converter-list");
        }
    }

    connectedCallback() {
        this.retrieveData();
    }
}