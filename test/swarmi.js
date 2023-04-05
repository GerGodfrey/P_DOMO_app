//import fetch from "node-fetch";
// const axios = require('axios');

// const url = "https://www.suarmi.com/api/v1";
// const url2 = "https://www.suarmi.com/api/v1/order";

// const data = `{"user": "viajandoencriptos@gmail.com",
//  "from_currency": "MXN",
//  "from_amount": "3500",
//  "to_currency": "USDC",
//  "to_address": "0xd0BCe03Bb2e0703BE66eF15DBDBf4c6B258e3DA6",
//  "network": "MATIC"
// }`;

// const data2 = {
//     "user": "viajandoencriptos@gmail.com",
//     "from_currency": "MXN",
//     "from_amount": "3500",
//     "to_currency": "USDC",
//     "to_address": "0xd0BCe03Bb2e0703BE66eF15DBDBf4c6B258e3DA6",
//     "network": "MATIC"
//   }

// async function requestSuarmi(){
//     let res = await axios(url,data2)
//     console.log(`Status: ${res.status}`)
// }


// requestSuarmi()


// const http = require("https");

// const url = 'https://www.suarmi.com/api/v1/order';

// const options = {
//     method: 'POST',
//     'Content-Type': 'application/json',
// };

// const data = `{"user": "viajandoencriptos@gmail.com",
//  "from_currency": "MXN",
//  "from_amount": "3500",
//  "to_currency": "USDC",
//  "to_address": "0xd0BCe03Bb2e0703BE66eF15DBDBf4c6B258e3DA6",
//  "network": "MATIC"
// }`;

// let result = '';
// const req = http.request(url, options, (res) => {
//     console.log(res.statusCode);

//     res.setEncoding('utf8');
//     res.on('data', (chunk) => {
//         result += chunk;
//     });

//     res.on('end', () => {
//         console.log(result);
//     });
// });

// req.on('error', (e) => {
//     console.error(e);
// });

// req.write(data);
// req.end();