const express = require('express');
const dbcall = require('./index');
const { nanoid, urlAlphabet } = require('nanoid');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// dbcall.graphQlmutation('https://reddit.com', 'redd');
// (async () => {
//     let data = await dbcall.graphQlquery('fb');
//     console.log(data);
// })();

// form to fill url details
app.get('/', (req, res, next) => {
    res.render('home');
})

//Page to redirect to short url
app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    data = await dbcall.graphQlquery(slug);
    if (data.count == 0) {
        res.status(404).json({ message: "No such short url exists" })
    } else {
        res.redirect(data.url);
    }
    res.send(`request made correctly with ${slug}`);
})

//Page to create short url
app.post('/', async (req, res, next) => {
    // console.log(req);
    let { url, slug } = req.body;
    let data;
    try {
        if (!url) {
            const error = new Error("Url not entered");
            error.statusCode = 422;
            throw error;
        }
        if (slug) {
            data = await dbcall.graphQlquery(slug);
            if (data.count != 0) {
                const error = new Error("Slug Already in database, use another or don't use any");
                error.statusCode = 422;
                throw error;
            }
        } else {
            slug = nanoid(5);
        }
        console.log("Values to be added");
        console.log(url);
        console.log(slug);
        data = await dbcall.graphQlmutation(url, slug);
        if (data.error) {
            const error = new Error(data.error);
            error.statusCode = 422;
            throw error;
        }
        data['shorturl'] = `localhost:3000/${data.slug}`;
        res.status(200).json({
            message: "Short Url created successfully",
            data: data
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


})


app.listen(port, () => {
    console.log("Listening on port " + port);
})