import { LightningElement, track } from 'lwc';

export default class CurrencyConverter extends LightningElement {
    base = 'USD';
    @track rates = [];
    lastRefreshDateTime;

    baseChangeHandler(e){
        this.base = e.detail;
        this.retrieveData();
    }

    getCurrentDateTime() {
        return (new Date()).toLocaleString();
    }

    retrieveData() {
        this.lastRefreshDateTime = this.getCurrentDateTime();

        fetch(`https://api.exchangeratesapi.io/latest?base=${this.base}`)
            .then(response => response.json())
            .then(data => {
                this.rates = Object.keys(data.rates).map(key => {
                    return { 'code': key, 'value': data.rates[key] };
                });
            })
            .catch(error => console.error(error));
    }

    connectedCallback() {
        this.retrieveData();
    }
}