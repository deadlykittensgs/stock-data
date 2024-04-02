// define the web scraper 

const cheerio = require("cheerio")

let stockTicker = "mrna"
let type = "history"

async function scrapeData(ticker) {
    try {
//fetch page html 
const url = `https://finance.yahoo.com/quote/${stockTicker}/${type}?p=${stockTicker}`
        const res = await fetch(url)
        const html = await res.text()

        const $ = cheerio.load(html)
        const price_history = getPrices($)
        return price_history
    }catch (err) {
        console.log(err.message)
    }
}

function getPrices(cher) {
    const prices = cher("td:nth-child(6)").get().map((current_value) => {
        return cher(current_value).text()
    })
return prices
}


// initialize server that serves up a html file user can play with 

const express = require("express")
const app = express()
const port = 8383

// middleware

app.use(express.json())
app.use(require("cors")())
app.use(express.static("public"))

app.listen(port, () => {console.log(`server has started on port ${port}`)})

// define api endpoint to access stock data (and call webscraper)

app.post('/api', async (req, res) => {
    const {stock_ticker: ticker} = req.body
    console.log(ticker)
    res.status(200).send({ prices})
})


app.listen(port, () => { console.log(`server has started on port: ${port}`) })