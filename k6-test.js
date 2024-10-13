import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigürasyon
export let options = {
    stages: [
        { duration: '30s', target: 50 },  // İlk 30 saniyede 50 sanal kullanıcıya ulaş
        // { duration: '1m', target: 50 },   // 1 dakika boyunca 50 sanal kullanıcı ile devam et
        // { duration: '10s', target: 0 },   // Son 10 saniyede sıfır kullanıcıya in
    ],
};

// Uygulamanızın URL'si
const BASE_URL = 'http://localhost:3000';

export default function () {
    // GET /products isteği yap
    let getRes = http.get(`${BASE_URL}/products`);
    check(getRes, {
        'GET /products status is 200': (r) => r.status === 200,
        'GET /products response length': (r) => r.json().length >= 0,
    });

    // POST /products isteği yap
    let payload = JSON.stringify({
        name: `Product ${Math.random()}`,
        price: Math.floor(Math.random() * 100),
    });

    let postRes = http.post(`${BASE_URL}/products`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(postRes, {
        'POST /products status is 201': (r) => r.status === 201,
    });

    sleep(1);  // Her istek arasında 1 saniye bekle
}
