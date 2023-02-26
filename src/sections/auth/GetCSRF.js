import { useState } from 'react';

export default function GetCSRF() {
  const [csrf, setCsrf] = useState('');

  fetch('http://localhost:8080/api/v1/csrf/', {
    credentials: 'include',
  })
    .then((res) => {
      const csrfToken = res.headers.get('X-CSRFToken');
      setCsrf(csrfToken);
      console.log(csrfToken);
    })
    .catch((err) => {
      console.log(err);
    });
}
