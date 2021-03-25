import { LightningElement, api } from 'lwc';

export default class CurrencyConverterList extends LightningElement {
    @api currencyData;

    connectedCallback(){
        setTimeout(()=>{
            console.log(JSON.parse(JSON.stringify(this.currencyData)));
        },2000);
    }

    renderedCallback(){
    }

}