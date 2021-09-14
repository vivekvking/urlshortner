const got = require('got');

console.log("Program started");
const target = "https://leading-cardinal-13.hasura.app/v1beta1/relay";

exports.graphQlquery = async (slug) => {
    let data;
    const query = `query first {
            urls_connection(where: {slug: {_eq: ${slug}}}) {
            edges {
                node {
                slug
                url
                }
            }
            }
        }`;
    const options = {
        headers: {
            "x-hasura-admin-secret": "rYu65ubIjSnc4X5AUlU5OLkNU1OnY1OHfPEso8laDTyNMebZIkJb7xLwo4XsgzrI",
            "Content-type": "application/json"
        },
        body: JSON.stringify({ query }),
    };
    await got.post(target, options)
        .then(res => {
            let body = JSON.parse(res.body);
            data = body.data.urls_connection.edges;
            console.log(body.data.urls_connection.edges);
        })
        .catch(err => {
            console.log(err.statusCode);
            console.log(err);
        });
    if (data.length == 0) {
        return { count: data.length }
    }
    return {
        count: data.length,
        url: data[0].node.url,
        slug: data[0].node.slug
    }
};

exports.graphQlmutation = async (url, slug) => {
    // console.log(url);
    // console.log(slug);
    let data;
    const query = `mutation {
            insert_urls_one (object:{
              url: "${url}"
              slug: "${slug}"
            }
            ){
              slug
              url
            }
          }`

    const options = {
        headers: {
            "x-hasura-admin-secret": "rYu65ubIjSnc4X5AUlU5OLkNU1OnY1OHfPEso8laDTyNMebZIkJb7xLwo4XsgzrI",
            "Content-type": "application/json"
        },
        body: JSON.stringify({ query }),
    };
    await got.post(target, options)
        .then(res => {
            let body = JSON.parse(res.body);
            // console.log(JSON.stringify(body));
            if (!body.data) {
                data = { error: body.errors[0].message }
            } else {
                data = body.data.insert_urls_one;
            }
            console.log(data);
        })
        .catch(err => {
            console.log(err.statusCode);
            console.log(err);
        });
    return { data }
};

// graphQlmutation("valorant.com", "valo");



