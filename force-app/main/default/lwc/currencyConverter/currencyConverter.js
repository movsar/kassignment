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
        fetch(`https://api.exchangeratesapi.io/latest?base=${this.base}`)
            .then(response => response.json())
            .then(data => {
                this.rates = Object.keys(data.rates).map(key => {
                    return { 'code': key, 'value': data.rates[key] };
                });
                this.lastRefreshDateTime = this.getCurrentDateTime();
                console.log('exchangeRate');
                console.log(this.rates);
                // setTimeout(() => {
                //     this.currencyConverterCalc.reCalculateFromBaseToQuote();
                // }, 500);
            })
            .catch(error => console.error(error));
    }
    currencyConverterCalc;

    renderedCallback(){
        this.currencyConverterCalc = this.template.querySelector("c-currency-converter-calc");
        console.log('rendered');
    }

    connectedCallback() {
        this.retrieveData();
    }
}