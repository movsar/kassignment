import { LightningElement, api, track } from 'lwc';

export default class CurrencyConverterList extends LightningElement {
    @api base;
    @api rates;
    @track currentPageRates = [];

    currentPage = 1;
    totalPages = 1;
    recordsPerPage = 11;

    initialized = false;

    rateClickHandler(event) {
        const newBase = event.currentTarget.dataset.currency;
        this.dispatchEvent(new CustomEvent('basechange', { detail: newBase }));
    }

    renderedCallback() {
        if (this.initialized === false && this.rates.length > 0) {
            this.initialized = true;
            this.totalPages = Math.ceil(this.rates.length / this.recordsPerPage);
            this.showCurrentPageRates();
        }
    }

    //#region pagination
    @api
    showCurrentPageRates() {
        console.log(JSON.parse(JSON.stringify(this.rates)));
        const showFrom = (this.currentPage - 1) * this.recordsPerPage;
        const showTo = showFrom + this.recordsPerPage;
        this.currentPageRates = this.rates.slice(showFrom, showTo);
    }

    previousButtonClickHandler() {
        if (--this.currentPage < 1) {
            this.currentPage = this.totalPages;
        }

        this.showCurrentPageRates();
    }

    nextButtonClickHandler() {
        if (++this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }

        this.showCurrentPageRates();
    }
    //#endregion
}