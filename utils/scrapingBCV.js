const puppeteer = require('puppeteer');


// declarando variables
let BCV$$ = 0;
let PARALEL$$ = 0;

let c = 0;

async function getDolarPrice() {
    console.log('iniciando Scraping')
    let timer = 0
    setInterval(() => {
        timer = timer + 100
    }, 100);

    do {

        c = c + 1;

        const browser = await puppeteer.launch({
            headless: true,
            slowMo: 10,
        });
        const page = await browser.newPage();
        await page.goto('https://alcambio.app/',{
            timeout: 3600000
        });

        setTimeout(()=>{console.log('waiting some ms')},3000)
        await page.click('.v-switch__thumb');
        console.log('cambiando a precio BCV');
        let bcv = await ScrapBCV(page);

        await page.click('.v-switch__thumb');
        console.log('cambiando a precio paralelo');
        let paralelo = await ScrapBCV(page);

        if (PARALEL$$ < paralelo) {
            console.log('el precio ha subido')
            PARALEL$$ = paralelo;
        } else {
            console.log(`no se actualiza el precio, paralelo aun en : ${PARALEL$$}`)
        }

        if (BCV$$ < bcv && bcv < PARALEL$$) {
            console.log('el precio ha subido')
            BCV$$ = bcv
        } else {
            console.log(`no se actualiza el precio, bcv aun en : ${BCV$$}`)
        }

        console.log(` |precio del dolar BCV Bs      ===> ${BCV$$} by Coding {JAR}`);
        console.log(` |precio del dolar Paralelo Bs ===> ${PARALEL$$} by Coding {JAR}`);
        console.log('------------------------------------------------------------');

        await browser.close();
        console.log(`el scraping se ha ejecutado: ${c} veces`);
        console.log('pagina cerrada');

    } while (BCV$$ == PARALEL$$)

    async function ScrapBCV(page) {
        let finalN;

        do {

            finalN = await page.evaluate(() => {
                const dolarElements = document.querySelectorAll('.text-white');
                const data = dolarElements[1].textContent;
                const rawNumber = data.split(' ');
                const number = parseFloat(rawNumber[1].replace(",", "."));
                return number.toFixed(2);
            });

            if (finalN < 36 || !finalN || finalN == 0 ) {
                console.log('Repitiendo scrapeo: precio erróneo---------', finalN);

            }
        } while (finalN < 36 || !finalN);

        return finalN;
    }

    console.log(`el scraping ha durado: ${timer}ms`);
    console.log('------------------------------------------------------------');
}

function updatePrice() {
    getDolarPrice()
    setInterval(getDolarPrice, 43200000); // actualiza precio Cada 12h
}

updatePrice();


const getBCV = () => BCV$$;
const getPARALEL = () => PARALEL$$;

module.exports = {
    getDolarPrice,
    getBCV,
    getPARALEL
};