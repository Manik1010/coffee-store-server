const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors');

// middleware.....
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello form Coffee Server')
})

app.listen(port, () => {
    console.log(`The news website API is runing For Coffee Server: ${port}`)
})