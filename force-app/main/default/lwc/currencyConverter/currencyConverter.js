import { LightningElement, track } from 'lwc';

export default class CurrencyConverter extends LightningElement {
    lastRefreshDateTime;
    @track currencyData = [];

    getCurrentDateTime(){
        return (new Date()).toLocaleString();
    }

    retrieveData(){
        this.lastRefreshDateTime = this.getCurrentDateTime();

        fetch('https://api.exchangeratesapi.io/latest')
            .then(response => response.json())
            .then(data => this.currencyData = data)
            .catch(error => console.error(error));
    }

    connectedCallback(){
        this.retrieveData();
    }
}