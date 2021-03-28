import { LightningElement, api, track } from 'lwc';
import { LocalSettings } from 'c/utils';
export default class CurrencyConverter extends LightningElement {
    //#region external parameters
    _baseCurrency = 'USD';
    @api get baseCurrency() {
        return this._baseCurrency;
    }
    set baseCurrency(value) {
        this._baseCurrency = value;
    }

    _ratesPerPage = 8;
    @api get ratesPerPage() {
        return this._ratesPerPage;
    }
    set ratesPerPage(value) {
        this._ratesPerPage = value;
    }
    //#endregion

    @track rates = [];
    @track currentPageRates = [];
    @track quoteCurrency;

    totalPages = 1;
    currentPage = 1;

    initialized = false;
    lastRefreshDateTime;

    getCurrentDateTime() {
        return (new Date()).toLocaleString();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    getRandomQuoteCurrency() {
        let index = this.getRandomInt(0, this.ratesPerPage);

        while (this.currentPageRates[index].code === this.baseCurrency) {
            index = this.getRandomInt(0, this.ratesPerPage);
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
                    this.rates = this.rates.sort((a, b) => (a.order > b.order) ? -1 : ((a.order < b.order) ? 1 : 0));
                    this.showCurrentPageRates();
                    if (!this.quoteCurrency) {
                        this.quoteCurrency = this.getRandomQuoteCurrency();
                    }

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

    //#region custom event handlers
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

    baseChangeHandler(e) {
        if (this.quoteCurrency === e.detail){
            this.quoteCurrency = this.baseCurrency;
        }

        this.baseCurrency = e.detail;
        this.retrieveData();
    }
    quoteChangeHandler(e) {
        this.quoteCurrency = e.detail;
    }
    //#endregion

    //#region lifecycle event handlers
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
    //#endregion
}