import { LightningElement, api, track } from 'lwc';
import { LocalSettings } from 'c/utils';

export default class CurrencyConverterList extends LightningElement {
    @api base;
    @api rates;
    @api currentPageRates;
    @api currentPage;
    @api totalPages;

    initialized = false;

    get rateStyle(){
        return 'slds-button slds-button_outline-brand slds-col slds-size_1-of-1';
    }

    rateClickHandler(event) {
        const newBase = event.currentTarget.dataset.currency;
        if (this.base === newBase){
            return;
        }

        LocalSettings.incrementCurrencyOrder(newBase);
        this.dispatchEvent(new CustomEvent('basechange', { detail: newBase }));
    }

    //#region pagination
    previousButtonClickHandler() {
        this.dispatchEvent(new CustomEvent('previouspage'));
    }

    nextButtonClickHandler() {
        this.dispatchEvent(new CustomEvent('nextpage'));
    }
    //#endregion
}