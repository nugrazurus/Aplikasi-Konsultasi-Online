import axios from 'axios';

export const getBimbinganPA = async (iddosen: number, periode: number) => {
  return await axios
    .get(`${process.env.GATEWAY_API_UNTAN}/verifikasi/get/${periode}/${iddosen}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const loginSiakadMahasiswa = async (username: string, password: string) => {
  return await axios
    .get(`${process.env.SIAKAD_ENDPOINT}/loginmhs/${username}/X${encodeURI(password)}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const loginSiakadDosen = async (username: string, password: string) => {
  return await axios
    .get(`${process.env.SIAKAD_ENDPOINT}/logindosen/X${username}/X${encodeURI(password)}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
