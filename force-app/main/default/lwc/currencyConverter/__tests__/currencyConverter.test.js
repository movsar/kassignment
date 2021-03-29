import { createElement } from 'lwc';
import CurrencyConverter from 'c/CurrencyConverter';
const mockData = require('./mockData.json');
const flushPromises = () => new Promise(setImmediate);
import fetchMock from "jest-fetch-mock";


describe('c-currency-converter', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('retrieve data test', async () => {
        const element = createElement('c-currency-converter', {
            is: CurrencyConverter
        });
        element.ratesPerPage = 2;
        
        fetchMock.enableMocks();
        fetch.mockResponseOnce(JSON.stringify({ rates: { CAD: 1.42 } }));

        document.body.appendChild(element);
        await flushPromises();

        const subheaderElement = element.shadowRoot.querySelector('[data-id=subheader]');
        const subheader = subheaderElement.textContent.split('on ')[1];
        const dateTimeNow = (new Date()).toLocaleString();

        // Check last update date time, as retrieveData is mocked, these should be the same
        expect(subheader).toEqual(dateTimeNow);
    });

});