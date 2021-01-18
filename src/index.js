const express = require('express')
const { Pool, Client } = require('pg')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
  pool: {
      max: 4
  }
});

const genProm1 = (nb) => new Promise((resolve, reject) => {
   
    setTimeout(async () => {
        if (nb) {
            await genProm1(nb -1);
        }
        return resolve(true);
    }, 0)
    
})
   

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
  });
  
sequelize.sync()
/*.then(() => User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
}))*/
/*.then(jane => {
    console.log(jane.toJSON());
});*/

const app = express()
const port = 3000

const pool = new Pool()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/pg1', async (req, res) => {
    try {
        const client = new Client()
        await client.connect()
        const result = await client.query('SELECT $1::text as message', ['Hello world!']);
        const message = result.rows[0].message
        await client.end()
        res.send(message);
    } catch(ex) {
        res.send(ex);
    }
})

app.get('/pg2', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW(), pg_sleep(0.1)');       
        const message = result.rows[0].now;        
        res.send(message);
    } catch(ex) {
        res.send(ex);
    }
})

app.get('/pg3', async (req, res) => {
    try {        
        const findObject = async (id) => await pool.query('SELECT NOW(');   
        const findAll = (nb) => [...Array(nb).keys()].map(findObject);
        const result = await Promise.all(findAll(10))     
        const message = JSON.stringify(result);        
        res.send(message);
    } catch(ex) {
        res.send(ex);
    }
})


app.get('/seq1', async (req, res) => {
    try {
        const result = await User.findAll();       
        const message = JSON.stringify(result);        
        res.send(message);
    } catch(ex) {
        res.send(ex);
    }
})

app.get('/seq2', async (req, res) => {
    try {        
        const findObject = async (id) => await User.findAll(); 
        const findAll = (nb) => [...Array(nb).keys()].map(findObject);
        const result = await Promise.all(findAll(10))     
        const message = JSON.stringify(result);        
        res.send(message);
    } catch(ex) {
        res.send(ex);
    }
})

app.get('/promise', async (req, res) => {
    const result = await genProm1(50)
    res.send(`promise: ${result}`);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})