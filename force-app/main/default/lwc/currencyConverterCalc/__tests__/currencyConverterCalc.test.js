import { createElement } from 'lwc';
import CurrencyConverterCalc from 'c/currencyConverterCalc';
const mockRates = require('./mockRates.json');
const flushPromises = () => new Promise(setImmediate);
describe('c-currency-converter-calc', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('ensures it works', async () => {
        const element = createElement('c-currency-converter-calc', {
            is: CurrencyConverterCalc
        });
        element.rates = mockRates;
        element.baseCurrency = 'USD';
        element.quoteCurrency = 'RUB';

        document.body.appendChild(element);
        // Wait for the renderer
        await flushPromises();

        const amountInBaseCurrencyElement = element.shadowRoot.querySelector('[data-id=amountInBaseCurrency]');
        const amountInQouteCurrencyElement = element.shadowRoot.querySelector('[data-id=amountInQuoteCurrency]');
       
        element.reCalculate(mockRates, 'BASE_TO_QUOTE');
        // Wait for the renderer
        await flushPromises();
        
        expect(parseInt(amountInBaseCurrencyElement.value)).toBe(1);
        expect(parseFloat(amountInQouteCurrencyElement.value)).toBe(104.683);
    });
});