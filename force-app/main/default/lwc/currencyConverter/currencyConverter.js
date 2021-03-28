import { LightningElement, api, track } from 'lwc';
import { LocalSettings, Constants } from 'c/utils';
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

                // This is to address issue with API inconsistencies
                if (!this.rates.find(rate => rate.code === this.baseCurrency)) {
                    let baseRateObject = { 'code': this.baseCurrency, 'value': 1, 'order':0 }
                    this.rates.push(baseRateObject);
                }

                this.totalPages = Math.ceil(this.rates.length / this.ratesPerPage);
                this.lastRefreshDateTime = this.getCurrentDateTime();

                // Order by use frequency i.e. favorites implementation
                this.rates = this.rates.sort((a, b) => (a.order > b.order) ? -1 : ((a.order < b.order) ? 1 : 0));
                
                this.showCurrentPageRates();
                
                if (!this.quoteCurrency) {
                    this.quoteCurrency = this.getRandomQuoteCurrency();
                }

                this.getCurrencyConverterCalcComponent().reCalculate(this.rates, Constants.BASE_TO_QUOTE, this.quoteCurrency);
            })
            .catch(error => console.error(error));
    }

    getCurrencyConverterCalcComponent(){
        return this.template.querySelector("c-currency-converter-calc");
    }

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
        if (this.quoteCurrency === e.detail) {
            this.quoteCurrency = this.baseCurrency;
        }

        this.baseCurrency = e.detail;
        this.retrieveData();
    }
    quoteChangeHandler(e) {
        if (this.baseCurrency === e.detail) {
            this.baseCurrency = this.quoteCurrency;
            this.quoteCurrency = e.detail;
            this.retrieveData();
            return;
        }
        this.quoteCurrency = e.detail;
    }
    //#endregion

    //#region lifecycle event handlers
    renderedCallback() {
        if (this.initialized === false && this.rates.length > 0) {
            this.initialized = true;
            // this.currencyConverterList = this.template.querySelector("c-currency-converter-list");
        }
    }

    connectedCallback() {
        this.retrieveData();
    }
    //#endregion
}