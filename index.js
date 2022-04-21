const fs = require('fs');
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8' )
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8' )
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8' )



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8' ) // ვკითხულობთ დათა ჯეისონის ფაილს,(ინფოს)
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true)

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const cardsHtml = dataObj.map(element => replaceTemplate(tempCard, element)).join()
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)

    } else if (pathname === '/product') {
        const product = dataObj[query.id]
        res.writeHead(200, {'Content-type': 'text/html'})
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
        console.log(query)
    } else if (pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-type': 'application/json'}) // გამოჩნდა იმეიჯებიც, სტიკერები და ა,შ რა
            res.end(data)
        })
    } else {
        res.end('page not found')
    }

})

server.listen(8000, '127.0.0.1', () => {
    console.log('listening to request on port 8000')
})
