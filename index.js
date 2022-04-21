const fs = require('fs');
const http = require('http')
const url = require('url')


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8' )
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8' )
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8' )

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output
}

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
