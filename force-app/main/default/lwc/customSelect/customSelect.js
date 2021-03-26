import { LightningElement, api } from 'lwc';

export default class AutocompleteCombobox extends LightningElement {
    @api availableOptions;
    @api defaultOption;
    
    initialized = false;
   
    renderedCallback(){
        if (this.initialized || !this.availableOptions) {
            return;
        }

        const datalist = this.template.querySelector('[data-id=available-options-list]');
        const combobox = this.template.querySelector("[data-id=option-selector]");

        datalist.setAttribute("id", "available-options-list");
        combobox.setAttribute("list", "available-options-list");

        this.initialized = true;
    }
}