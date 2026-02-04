import axios from 'axios';

const BASIC_AUTH = Buffer.from(`45add97e-649b-4509-8e40-a61bc5a6ef84:dp+yuU`).toString('base64');

const response = await axios.get(
  `https://demo.vivapayments.com/api/messages/config/token`,
  {
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
    },
  },
);

const token = response.data.Key;
console.log(token);
