import { LightningElement, api } from 'lwc';

export default class CurrencyConverterList extends LightningElement {
    @api base;
    @api rates;

    rateClickHandler(event){
        const newBase = event.currentTarget.dataset.currency;
        button_brand
        this.dispatchEvent(new CustomEvent('basechange', { detail: newBase }));
    }

}