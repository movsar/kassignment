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

    it('gbp to rub test', async () => {
        const element = createElement('c-currency-converter-calc', {
            is: CurrencyConverterCalc
        });
        element.rates = mockRates;
        element.baseCurrency = 'GBP';
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

    it('recalculations on amount change', async () => {
        const element = createElement('c-currency-converter-calc', {
            is: CurrencyConverterCalc
        });
        element.rates = mockRates;
        element.baseCurrency = 'GBP';
        element.quoteCurrency = 'RUB';

        document.body.appendChild(element);
        // Wait for the renderer
        await flushPromises();

        const amountInBaseCurrencyElement = element.shadowRoot.querySelector('[data-id=amountInBaseCurrency]');
        const amountInQouteCurrencyElement = element.shadowRoot.querySelector('[data-id=amountInQuoteCurrency]');
      
        // Test result when amount in base currency has changed
        amountInBaseCurrencyElement.value = '20';
        amountInBaseCurrencyElement.dispatchEvent(new CustomEvent("input"));
        await flushPromises();

        let result = parseFloat(amountInQouteCurrencyElement.value);
        expect(result).toBe(2093.669);

        // Test result when amount in quote currency has changed
        amountInQouteCurrencyElement.value = '10';
        amountInQouteCurrencyElement.dispatchEvent(new CustomEvent("input"));
        await flushPromises();
        
        result = parseFloat(amountInBaseCurrencyElement.value);
        expect(result).toBe(0.096);
    });
});