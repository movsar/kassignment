import { LightningElement, api, track } from 'lwc';

export default class CurrencyConverterCalc extends LightningElement {
    @api base;
    @api rates;

    get ratesAsComboboxOptions(){
        return this.rates.map(rate => { return {'label':rate.name,'value':rate.name };});
    }

    handleSelectedRateChange(){
        
    }
    
    toPlainObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    renderedCallback(){

    }
   
}