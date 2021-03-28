import { LightningElement, api, track } from 'lwc';
import { LocalSettings } from 'c/utils';
export default class CurrencyConverter extends LightningElement {
    @track rates = [];
    initialized = false;
    lastRefreshDateTime;
    @track currentPageRates = [];

    currentPage = 1;
    totalPages = 1;

    _baseCurrency = 'USD';
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

    _ratesPerPage = 8;
    @api get ratesPerPage() {
        return this._ratesPerPage;
    }
    set ratesPerPage(value) {
        this._ratesPerPage = value;
    }

    baseChangeHandler(e) {
        this.baseCurrency = e.detail;
        this.retrieveData();
    }

    getCurrentDateTime() {
        return (new Date()).toLocaleString();
    }

    getRandomQuoteCurrency(){
        let index = Math.floor(Math.random() * Math.floor(this.ratesPerPage));

        while (this.currentPageRates[index].code === this.baseCurrency){
            index = Math.floor(Math.random() * Math.floor(this.ratesPerPage));
        }

        return this.currentPageRates[index].code;
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
                    this.showCurrentPageRates();
                    this.quoteCurrency = this.getRandomQuoteCurrency();
                    this.currencyConverterCalc.reCalculateFromBaseToQuote();
                    this.totalPages = Math.ceil(this.rates.length / this.ratesPerPage);
                }, 500);
            })
            .catch(error => console.error(error));
    }
    currencyConverterCalc;

    showCurrentPageRates() {
        const showFrom = (this.currentPage - 1) * this.ratesPerPage;
        const showTo = showFrom + this.ratesPerPage;
        this.currentPageRates = this.rates.slice(showFrom, showTo);
    }

    previousPageHandler() {
        if (--this.currentPage < 1) {
            this.currentPage = this.totalPages;
        }

        this.showCurrentPageRates();
    }

    nextPageHandler() {
        if (++this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }

        this.showCurrentPageRates();
    }

    renderedCallback() {
        if (this.initialized === false && this.rates.length > 0) {
            this.initialized = true;
            this.currencyConverterCalc = this.template.querySelector("c-currency-converter-calc");
            this.currencyConverterList = this.template.querySelector("c-currency-converter-list");
        }
    }

    connectedCallback() {
        this.retrieveData();
    }
}