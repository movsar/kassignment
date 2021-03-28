import { LightningElement, api } from 'lwc';

export default class CurrencyConverterListItem extends LightningElement {
    @api rate;
    @api base;
    @api marked = false;

    get rateStyle(){
        console.log('ratestyle');
        console.log(this.rate.code);
        console.log(this.base);
        if (this.rate.code === this.base){
            return 'slds-button slds-button_brand slds-col slds-size_1-of-1';    
        }
        return 'slds-button slds-button_outline-brand slds-col slds-size_1-of-1';
    }
}