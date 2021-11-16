import axios from 'axios';

export const getPeriode = async () => {
  const periode = await axios
    .get(`${process.env.DPNA_ENDPOINT}/getperiodelirs`, { timeout: 5000 })
    .then((res) => {
      console.log(res.data);
      return {
        status: true,
        mesage: 'success',
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: false,
        message: err.response.message,
      };
    });
  return periode;
};
