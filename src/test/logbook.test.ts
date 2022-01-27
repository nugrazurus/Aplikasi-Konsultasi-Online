import axios from 'axios';
import * as controller from '../controllers/logbookController';

describe('logbook', () => {
  test('get', async () => {
    // const data = controller.show(req)
    const get = await axios.get('https://google.com').catch((err) => err);
    expect(get.status).toBe(200);
  });
});
