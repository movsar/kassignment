import { LightningElement, api } from 'lwc';

export default class CurrencyConverterListItem extends LightningElement {
    @api rate;
    @api base;
    @api marked = false;

    basicStyle = 'slds-button slds-col slds-size_1-of-1';

    get rateStyle(){
        if (this.rate.code === this.base){
            return `${this.basicStyle} slds-button_brand`;
        }
        return `${this.basicStyle} slds-button_outline-brand`;
    }
}