import { getTripLength } from './app.js'

import { buttonHandler } from './buttonHandler.js'

test('This is expected to be defined', () => {
    expect(buttonHandler).toBeDefined();
});

test('This function should return a value of type number', () => {
    expect(typeof getTripLength()).toBe('number');
});

