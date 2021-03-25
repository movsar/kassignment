import { LightningElement } from 'lwc';

export default class CurrencyConverter extends LightningElement {
    lastRefreshDateTime;

    connectedCallback(){
        this.lastRefreshDateTime = (new Date()).toLocaleString();
    }
}