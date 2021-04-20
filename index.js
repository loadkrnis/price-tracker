const puppeteer = require('puppeteer');

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
    return true;
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

(async () => {
    try {
        /* Open the Browser with some options
       headless:
       devtools: dev mode 일때 사용합니다.
       */
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true,
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1366,
            height: 768
        });
        await page.goto('https://www.yanolja.com/hotel/r-910204/?advert=AREA&hotel=1');
        await sleep(2000);
        await autoScroll(page);
        const find = await page.evaluate(() => {
            const target = ['여의도 M 호텔', '호텔 더 디자이너스 홍대', '신라스테이 마포', '콘래드 서울'];
            const cardList = document.querySelectorAll('.PlaceListItemText_container__fUIgA.text-unit');
            let result = {};
            for (let i = 0; i < cardList.length; i++) {
                hotelName = cardList[i].querySelector('.PlaceListTitle_text__2511B.small').textContent.trim();
                hotelPrice = cardList[i].querySelector('.PlacePriceInfo_salePrice__28VZD').textContent.trim();
                console.log( hotelName +" : " + hotelPrice);
                console.log(target);
                if (target.indexOf(hotelName) >= 0) {
                    result[hotelName] = hotelPrice;
                }
            }
            return result;
        });
        console.log(find);
        // await browser.close(); // Close Browser
    } catch (error) {
        console.error(error);
    }
})();