import { LightningElement, api, track } from 'lwc';
import { LocalSettings, Constants, Utils } from 'c/utils';
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

    //#region data
    parseRates(data) {
        let rates = Object.keys(data.rates).map(key => {
            return { 'code': key, 'value': data.rates[key], 'order': LocalSettings.getCurrencyOrder(key) };
        });

        // This is to address issue with API inconsistencies
        if (!rates.find(rate => rate.code === this.baseCurrency)) {
            let baseRateObject = { 'code': this.baseCurrency, 'value': 1, 'order': LocalSettings.getCurrencyOrder(this.baseCurrency) }
            rates.push(baseRateObject);
        }

        // Sort by usage frequency
        this.rates = this.rates.sort((a, b) => (a.order > b.order) ? -1 : ((a.order < b.order) ? 1 : 0));

        return rates;
    }

    retrieveData() {
        fetch(`https://api.exchangeratesapi.io/latest?base=${this.baseCurrency}`)
            .then(response => response.json())
            .then(data => {
                this.rates = this.parseRates(data);
                this.updateView();
            })
            .catch(error => console.error(error));
    }
    //#endregion

    //#region view
    get currencyConverterCalcComponent() {
        return this.template.querySelector("c-currency-converter-calc");
    }

    getRandomQuoteCurrency() {
        let index = Utils.getRandomInt(0, this.ratesPerPage);

        while (this.currentPageRates[index].code === this.baseCurrency) {
            index = Utils.getRandomInt(0, this.ratesPerPage);
        }

        return this.currentPageRates[index].code;
    }

    updateView() {
        this.totalPages = Math.ceil(this.rates.length / this.ratesPerPage);
        this.getCurrentPageRates();

        if (!this.quoteCurrency) {
            this.quoteCurrency = this.getRandomQuoteCurrency();
        }

        this.currencyConverterCalcComponent.reCalculate(this.rates, Constants.BASE_TO_QUOTE, this.quoteCurrency);
        this.lastRefreshDateTime = Utils.getCurrentDateTime();
    }

    getCurrentPageRates() {
        const showFrom = (this.currentPage - 1) * this.ratesPerPage;
        const showTo = showFrom + this.ratesPerPage;
        this.currentPageRates = this.rates.slice(showFrom, showTo);
    }
    //#endregion

    //#region event handlers
    renderedCallback() {
        if (this.initialized === false && this.rates.length > 0) {
            this.initialized = true;
        }
    }

    connectedCallback() {
        this.retrieveData();
    }

    previousPageHandler() {
        if (--this.currentPage < 1) {
            this.currentPage = this.totalPages;
        }

        this.getCurrentPageRates();
    }

    nextPageHandler() {
        if (++this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }

        this.getCurrentPageRates();
    }

    baseCurrencyChangeHandler(e) {
        LocalSettings.incrementCurrencyOrder(e.detail);

        if (this.quoteCurrency === e.detail) {
            this.quoteCurrency = this.baseCurrency;
        }

        this.baseCurrency = e.detail;
        this.currencyConverterCalcComponent.reCalculate(this.rates, Constants.BASE_TO_QUOTE, this.quoteCurrency);
    }

    quoteCurrencyChangeHandler(e) {
        LocalSettings.incrementCurrencyOrder(e.detail);

        if (this.baseCurrency === e.detail) {
            this.baseCurrency = this.quoteCurrency;
            this.quoteCurrency = e.detail;
            return;
        }

        this.quoteCurrency = e.detail;
        this.currencyConverterCalcComponent.reCalculate(this.rates, Constants.BASE_TO_QUOTE, this.quoteCurrency);
    }
    //#endregion
}