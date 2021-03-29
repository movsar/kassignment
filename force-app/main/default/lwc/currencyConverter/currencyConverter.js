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

    lastRefreshDateTime;

    //#region data
    updateCache(data) {
        Utils.gbpRates = Object.keys(data.rates).map(key => {
            return { 'code': key, 'value': data.rates[key] };
        });

        // This is to address issue with API inconsistencies
        if (!Utils.gbpRates.find(rate => rate.code === this.baseCurrency)) {
            let baseRateObject = { 'code': this.baseCurrency, 'value': 1 }
            Utils.gbpRates.push(baseRateObject);
        }
    }

    retrieveData() {
        console.log('retrieveData');
        fetch(`https://api.exchangeratesapi.io/latest?base=GBP`)
            .then(response => response.json())
            .then(data => {
                this.updateCache(data);
                this.updateView();
                this.lastRefreshDateTime = Utils.getCurrentDateTime();
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
        this.rates = Utils.calculateRates(this.baseCurrency);

        this.totalPages = Math.ceil(this.rates.length / this.ratesPerPage);
        this.getCurrentPageRates();

        if (!this.quoteCurrency) {
            this.quoteCurrency = this.getRandomQuoteCurrency();
        }

        this.currencyConverterCalcComponent.reCalculate(this.rates, Constants.BASE_TO_QUOTE, this.quoteCurrency);
    }

    getCurrentPageRates() {
        const showFrom = (this.currentPage - 1) * this.ratesPerPage;
        const showTo = showFrom + this.ratesPerPage;
        this.currentPageRates = this.rates.slice(showFrom, showTo);
    }
    //#endregion

    //#region event handlers
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
        this.updateView();
    }

    quoteCurrencyChangeHandler(e) {
        LocalSettings.incrementCurrencyOrder(e.detail);

        if (this.baseCurrency === e.detail) {
            this.baseCurrency = this.quoteCurrency;
        }

        this.quoteCurrency = e.detail;
        this.updateView();
    }
    //#endregion
}