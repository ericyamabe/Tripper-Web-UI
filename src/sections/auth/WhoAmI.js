export default function WhoAmI() {
  fetch('http://localhost:8080/api/v1/whoami/', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(`You are logged in as: ${data.username}`);
      console.log(`Your user ID is: ${data.id}`);
      console.log(`Your email is: ${data.email}`);
    })
    .catch((err) => {
      console.log(err);
    });
}