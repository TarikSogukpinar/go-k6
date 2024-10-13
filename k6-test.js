import http from 'k6/http';
import { check, sleep } from 'k6';


export let options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '30s', target: 50 },
        { duration: '30s', target: 250 },
        { duration: '30s', target: 350 },
        { duration: '30s', target: 450 },

    ],
};


const BASE_URL = 'http://localhost:3000';


export default function () {

    let getRootRes = http.get(`${BASE_URL}/`);
    check(getRootRes, {
        'GET / status is 200': (r) => r.status === 200,
        'GET / body contains Hello, World!': (r) => r.body.includes('Hello, World!'),
    });


    let getProductsRes = http.get(`${BASE_URL}/products`);
    check(getProductsRes, {
        'GET /products status is 200': (r) => r.status === 200,
        'GET /products response length': (r) => r.json()
    });


    let payload = JSON.stringify({
        name: `Product ${Math.random()}`,
        price: Math.floor(Math.random() * 100),
    });

    let postProductsRes = http.post(`${BASE_URL}/products`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(postProductsRes, {
        'POST /products status is 201': (r) => r.status === 201,
    });

    sleep(1);
}