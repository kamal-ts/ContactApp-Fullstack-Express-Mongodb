const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dcc');

// tes koneksi
const db = mongoose.connection;
db.on('error', (error) => console.info(error));
db.once('open', () => console.info('Database Connected...'));

// const contact1 = new Contact({
//     name: 'Uwais ALkarni',
//     noHP: '0813432234124',
//     email: 'wais@gmail.com'
// })

// contact1.save().then((result) => {
//     console.info(result)
// })
