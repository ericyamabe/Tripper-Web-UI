import axios from 'axios';
import { WHOAMI_URL } from './urls';

export default function WhoAmI() {
  axios
    .get(WHOAMI_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    .then((response) => {
      const data = response.data;
      console.log(`You are logged in as: ${data.username}`);
      console.log(`Your user ID is: ${data.id}`);
      console.log(`Your email is: ${data.email}`);
      console.log(`You're an admin: ${data.role}`);
    })
    .catch((error) => {
      console.log(error);
    });
}
