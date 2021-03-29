import { createElement } from 'lwc';
import CurrencyConverterCalc from 'c/currencyConverterCalc';
const mockRates = require('./mockRates.json');

describe('c-currency-converter-calc', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('ensures it works', () => {
        const element = createElement('c-currency-converter-calc', {
            is: CurrencyConverterCalc
        });
        element.rates = mockRates;
        element.baseCurrency = 'USD';
        element.quoteCurrency = 'RUB';
        document.body.appendChild(element);

        // Use a promise to wait for asynchronous changes to the DOM
        return Promise.resolve().then(() => {
            const amountInBaseCurrencyElement = element.shadowRoot.querySelector('[data-id=amountInBaseCurrency]');
            expect(parseInt(amountInBaseCurrencyElement.value)).toBe(1);
        });
    });
});