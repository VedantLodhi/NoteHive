fetch('https://res.cloudinary.com/dewiksnzp/raw/upload/v1779010871/notehive_uploads/1779010868081-test.pdf').then(r => {
  console.log(r.status);
  r.headers.forEach((v, k) => console.log(k, v));
}).catch(console.error);
