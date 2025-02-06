import { app } from './app.js';
import connecttoDB from './src/db/db.js';
import dotenv from 'dotenv';




const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

dotenv.config(
  {
      path: './.env'
  }
);

//connect to mongo db 
connecttoDB().then(() => {

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

}).catch((err) => console.log("error in db connection", err))
