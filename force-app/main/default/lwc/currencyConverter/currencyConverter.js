import { LightningElement, api, track } from 'lwc';
import { LocalSettings } from 'c/utils';
export default class CurrencyConverter extends LightningElement {
    @track rates = [];
    initialized = false;
    lastRefreshDateTime;

    _baseCurrency;
    @api get baseCurrency() {
        console.log(`_baseCurrency ${this._baseCurrency}`);
        return this._baseCurrency;
    }
    set baseCurrency(value) {
        console.log(`_baseCurrency ${this._baseCurrency}`);
        if (value === this.quoteCurrency) {
            return;
        }
        this._baseCurrency = value;
    }

    _ratesPerPage;
    @api get ratesPerPage() {
        console.log(`ratesPerPage ${this._ratesPerPage}`);
        return this._ratesPerPage;
    }
    set ratesPerPage(value) {
        console.log(`ratesPerPage ${this._ratesPerPage}`);
        this._ratesPerPage = value;
    }

    baseChangeHandler(e) {
        this.baseCurrency = e.detail;
        this.retrieveData();
    }

    getCurrentDateTime() {
        return (new Date()).toLocaleString();
    }

    retrieveData() {
        fetch(`https://api.exchangeratesapi.io/latest?base=${this.baseCurrency}`)
            .then(response => response.json())
            .then(data => {
                this.rates = Object.keys(data.rates).map(key => {
                    return { 'code': key, 'value': data.rates[key], 'order': LocalSettings.getCurrencyOrder(key) };
                });

                this.lastRefreshDateTime = this.getCurrentDateTime();

                setTimeout(() => {
                    console.log(this.rates);
                    this.rates = this.rates.sort((a, b) => (a.order > b.order) ? -1 : ((a.order < b.order) ? 1 : 0));
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