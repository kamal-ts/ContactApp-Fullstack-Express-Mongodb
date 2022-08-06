const express = require('express')
const { body, validationResult, check } = require('express-validator');

require('./utils/database');
const Contact = require('./model/contact');



const app = express();
const port = 3000;

// setup ejs
app.set('view engine', 'ejs');
app.use(express.static('public')) //untuk menentukan folder/file yang dapat diakses dari url
app.use(express.urlencoded({ extended: true })); //untuk mangambil data dari form


// halaman home
app.get('/', (req, res) => {

    const mahasiswa = [{
        nama: 'Kamaluddin',
        email: 'kamaluddin@gmail.com'
    }, {
        nama: 'Uwais',
        email: 'Uwais@gmail.com'
    }, {
        nama: 'Andi ichsan',
        email: 'ichsan@gmail.com'
    }];
    // res.sendFile('./index.html', {root: __dirname})
    res.render('layouts/content', {
        nama: 'Kamaluddin',
        title: 'home',
        mahasiswa,
        vContent: "../index" //ini view yang di bikin variable
    })
})

// halaman about
app.get('/about', (req, res) => {
    res.render('layouts/content',
        {
            nama: 'Kamaluddin',
            title: 'about',
            vContent: "../about"
        })
})

// halaman contacts
app.get('/contact', async (req, res) => {

    // Contact.find().then((contact) =>{
    //     res.send(contact);
    // })

    const contacts = await Contact.find();

    res.render('layouts/content',
        {
            nama: 'Kamaluddin',
            title: 'contact',
            contacts,
            vContent: "../contact/index"
        })
})

// halaman untuk tambah data cotact
app.get('/contact/add', (req, res) => {

    res.render('layouts/content',
        {
            nama: 'Kamaluddin',
            title: 'Tambah Data Contac',
            pesanErr: false,
            body: false,
            vContent: "../contact/add-contact"
        })
})

// post data contact
app.post(
    '/contact',
    [
        check('email', 'Email tidak valid!').isEmail(),
        check('noHP', 'Nomor hp tidak valid!').isMobilePhone('id-ID'),
        body('name').custom(async (value) => {
            const duplicate = await Contact.findOne({ name: value });
            if (duplicate) {
                throw new Error('Nama contact sudah digunakan!');
            }
            return true;
        }),
    ],
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });

            // pecahkan pesan error
            const findMsg = (name) => {
                const msg = errors.array().find(err => err.param === name);
                return !msg ? false : msg;
            }

            // buat pesan eror
            const pesanErr = {
                nameErr: findMsg('name'),
                emailErr: findMsg('email'),
                noHPErr: findMsg('noHP')
            }

            res.render('layouts/content',
                {
                    nama: 'Kamaluddin',
                    title: 'Tambah Data Contac',
                    pesanErr,
                    body: req.body,
                    vContent: "../contact/add-contact"
                })
        } else {

            Contact.insertMany((req.body), (err, result) => {
                res.redirect('/contact');
            })
            // const contact = new Contact(req.body);
            // contact.save().then((result) => {
            //     res.redirect('/contact');
            // })
        }

    })

// hapus contact
app.get('/contact/delete/:id', (req, res) => {

    Contact.deleteOne({ _id: req.params.id })
        .then((result) => res.redirect('/contact'))
        .catch(err => res.status(404).send('<h1>404</h1>'));
})

// form ubah data contact
app.get('/contact/edit/:name', async (req, res) => {

    const contact = await Contact.findOne({ name: req.params.name });

    res.render('layouts/content',
        {
            nama: 'Kamaluddin',
            title: 'Form Edit Contact',
            pesanErr: false,
            body: false,
            contact,
            vContent: "../contact/edit"
        })
})

// post data contact
app.post(
    '/contact/update',
    [
        check('email', 'Email tidak valid!').isEmail(),
        check('noHP', 'Nomor hp tidak valid!').isMobilePhone('id-ID'),
        body('name').custom(async (value, { req }) => {
            const duplicate = await Contact.findOne({ name: value });
            if (value.toLowerCase() !== req.body.oldName.toLowerCase() && duplicate) {
                throw new Error('Nama contact sudah digunakan!');
            }
            return true;
        }),
    ],
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // pecahkan pesan error
            const findMsg = (name) => {
                const msg = errors.array().find(err => err.param === name);
                return !msg ? false : msg;
            }

            // buat pesan eror
            const pesanErr = {
                nameErr: findMsg('name'),
                emailErr: findMsg('email'),
                noHPErr: findMsg('noHP')
            }

            res.render('layouts/content',
                {
                    nama: 'Kamaluddin',
                    title: 'Tambah Data Contac',
                    pesanErr,
                    body: req.body,
                    vContent: "../contact/edit"
                })
        } else {

            Contact.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        name: req.body.name,
                        noHP: req.body.noHP,
                        email: req.body.email
                    }
                }

            ).then(result => { res.redirect('/contact') })
        }

    })


// halaman untuk detail contact
app.get('/contact/:name', async (req, res) => {

    const contact = await Contact.findOne({ name: req.params.name });
    // if(contact === null) contact = false;

    res.render('layouts/content',
        {
            nama: 'Kamaluddin',
            title: 'Detail Contact',
            contact,
            vContent: "../contact/detail"
        })
})

app.use((req, res) => {
    res.status(404)
    res.send('<h1>404</h1>');
})


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})