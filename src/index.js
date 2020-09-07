const express = require('express');
const app = express();

// Body parser
app.use(express.json());

app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`)
})
