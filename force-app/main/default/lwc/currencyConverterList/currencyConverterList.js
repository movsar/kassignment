import { LightningElement, api } from 'lwc';

export default class CurrencyConverterList extends LightningElement {
    @api baseCurrency;
    @api rates;
    @api currentPageRates;
    @api currentPage;
    @api totalPages;

    initialized = false;

    currenciesListItemClickHandler(event) {
        const newBaseCurrency = event.currentTarget.dataset.currency;
        if (this.base === newBaseCurrency){
            return;
        }

        this.dispatchEvent(new CustomEvent('basechange', { detail: newBaseCurrency }));
    }

    previousButtonClickHandler() {
        this.dispatchEvent(new CustomEvent('previouspage'));
    }

    nextButtonClickHandler() {
        this.dispatchEvent(new CustomEvent('nextpage'));
    }
}