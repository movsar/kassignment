import { LightningElement, api } from 'lwc';

export default class CurrencyConverterListItem extends LightningElement {
    @api rate;
    @api baseCurrency;
    @api marked = false;

    basicStyle = 'slds-button slds-col slds-size_1-of-1';

    get buttonTitle(){
        return `${parseFloat(this.rate.value.toFixed(3))} ${this.rate.code}`;
    }

    get rateStyle(){
        if (this.rate.code === this.baseCurrency){
            return `${this.basicStyle} slds-button_brand`;
        }
        return `${this.basicStyle} slds-button_outline-brand`;
    }
}