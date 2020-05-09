import { port } from './index.js'

test('This port should be set to 8080', () => {
    expect(port).toBe(8080);
});
