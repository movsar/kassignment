import { createElement } from 'lwc';
import CurrencyConverterCalc from 'c/currencyConverterCalc';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
const mockGetRates = require('./mockRates.json');
// Register a test wire adapter.
const flushPromises = () => new Promise(setImmediate);
describe('c-currency-converter-calc', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('ensures it works', async() => {
        const element = createElement('c-currency-converter-calc', {
            is: CurrencyConverterCalc
        });
        // Add the element to the jsdom instance
        element.rates = [{
            "code": "RUB",
            "value": 104.683461399,
            "order": 21
        }];
        document.body.appendChild(element);
        await flushPromises();
        // // Verify displayed greeting
        // const div = element.shadowRoot.querySelector('div');
        // expect(div.textContent).toBe('Unit 5 alive!');

        // Use a promise to wait for asynchronous changes to the DOM
        const amountInBaseCurrencyElement = element.shadowRoot.querySelector('[data-id=amountInBaseCurrency]');
        expect(parseInt(amountInBaseCurrencyElement.value)).toBe(1);
    });
});