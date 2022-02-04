import * as service from '../service/siakad';

// describe('Get Bimbingan PA', () => {
//     test('get', async () => {
//         const bimbinganPa = await service.getBimbinganPA(1231, 374);
//         expect(bimbinganPa).toHaveProperty('')
//     })
// })

jest.mock('axios');

describe('login mahasiswa', () => {
  test('login', async () => {
    const successHandler = jest.fn();
    const errorHandler = jest.fn();
    // const login =
    // const login = await service.loginSiakadMahasiswa('asd', 'asd');
  });
});
