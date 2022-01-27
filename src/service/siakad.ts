import axios from 'axios';

export const getBimbinganPA = async (iddosen: number, periode: number) => {
  return await axios
    .get(`${process.env.GATEWAY_API_UNTAN}/verifikasi/get/${periode}/${iddosen}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
};

export const loginSiakadMahasiswa = async (username: string, password: string) => {
  return await axios
    .get(`${process.env.SIAKAD_ENDPOINT}/loginmhs/${username}/X${encodeURI(password)}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
};

export const loginSiakadDosen = async (username: string, password: string) => {
  return await axios
    .get(`${process.env.SIAKAD_ENDPOINT}/logindosen/X${username}/X${encodeURI(password)}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
};

export const getPicByNim = async (nim: string) => {
  return await axios
    .get(`${process.env.DPNA_ENDPOINT}/mhs/getpicbynim/${nim}`, { responseType: 'arraybuffer' })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const uint8 = new TextEncoder().encode(err);
      return new TextDecoder().decode(uint8);
    });
};

export const getPeriode = async () => {
  return await axios
    .get(`${process.env.DPNA_ENDPOINT}/getperiodelirs`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
};

export const getPicByNip = async (nip: string) => {
  return await axios
    .get(`${process.env.BKD_ENDPOINT}/pub/${nip}`, { responseType: 'arraybuffer' })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const uint8 = new TextEncoder().encode(err);
      return new TextDecoder().decode(uint8);
    });
};
