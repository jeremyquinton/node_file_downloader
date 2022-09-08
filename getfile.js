const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');

run();

function run () {
    (async () => {
    
        let path = '';
        let headlessValue = '';
        let downloadPath = '';
        
        console.log(os.platform());
        if (os.platform() === 'linux')  {
            downloadPath = '/var/www/nodefiledownloader/download';
            headlessValue = true;
            path = '/var/www/nodefiledownloader/node_modules/puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome';
        } else {
            downloadPath = '/Users/jeremyquinton/Development/standalone/download';
            headlessValue = false;  
            path = '/Users/jeremyquinton/Development/standalone/node_modules/puppeteer/.local-chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium';
        }

        const browser = await puppeteer.launch({
            headless: headlessValue,
            args: [
                `--disable-web-security`,
                `--disable-features=IsolateOrigins,site-per-process`,
                `--window-size=2048,1024`,
		        `--no-sandbox`     
            ],
	        executablePath: path,
        });

        let page = await browser.newPage();

        await page.setViewport({
            width: 2048,
            height: 1024,
        });

        var url = 'https://seller.takealot.com/shipments/replenishment-orders';
        await page.goto(url, {waitUntil: 'networkidle0'});

        console.log("waiting for cookie popup to load");
        await page.waitForTimeout(5000);
        await page.waitForSelector('#wfx-frame-popup');
        const elementHandleFirst = await page.$('#wfx-frame-popup');
        const iframeFirst = await elementHandleFirst.contentFrame();
        await iframeFirst.waitForSelector('#segment_prim_btn_1');
        const clickpopupDontShowAgainFist = await iframeFirst.click('#segment_prim_btn_1');

        await page.waitForSelector('input[name=email]', { timeout: 5000 });
        await page.hover('input[name=email]');
        await page.click('input[name=email]', {'button':'middle','delay':'100'});
        await page.type('input[name=email]',"miscstoreza@gmail.com");
        await page.hover('input[name=password]');
        await page.click('input[name=password]', {'button':'middle','delay':'100'});
        await page.type('input[name=password]',"maxjackQcSPA6ep@maxjack");
        await page.click('button.ui.blue.large.fluid.button');
        await page.waitForNavigation(); 
        console.log("logged in");  
        var url = 'https://seller.takealot.com/shipments/replenishment-orders';
        await page.goto(url, { waitUntil: 'networkidle0' });
        //wait for the popup and click it
        //div surrouding iframe

        console.log("waiting for popup to load");
        await page.waitForTimeout(5000);
        await page.waitForSelector('#wfx-frame-popup');
        const elementHandle = await page.$('#wfx-frame-popup');
        const iframe = await elementHandle.contentFrame();
        await iframe.waitForSelector('#popupDontShowAgain');
        console.log("clicked don't show this button again");
        const clickpopupDontShowAgain = await iframe.click('#popupDontShowAgain');
        const clickpopupClosePanel = await iframe.click('#popupClosePanel');
        await page.waitForTimeout(5000);
        var url = 'https://seller.takealot.com/shipments/replenishment-orders';
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForTimeout(5000);

        const client = await page.target().createCDPSession();
        await client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: downloadPath, // Change this to your desired download path.
        })

        await page.waitForTimeout(2000); 
        const [button_replenishment] = await page.$x("//button[contains(., 'Bulk Replenishment')]");
        if (button_replenishment) {
            button_replenishment.hover();
            await button_replenishment.click();
        }
        console.log("clicked bulk replenishment button");
        const [button_export_bulk_template] = await page.$x("//button[contains(., 'Export Bulk Replenishment Template')]");
        
        if (button_export_bulk_template) {
            button_export_bulk_template.hover();
            await button_export_bulk_template.click();
        }
        console.log("clicked Export Bulk Replenishment Template");
        await page.waitForTimeout(25000); 
        const [button_download] = await page.$x("//button[contains(., 'Download')]");
        
        if (button_download) {
            button_download.hover();
            await button_download.click();
        }
        console.log("clicked Download button");
        await page.waitForTimeout(5000); 

        await browser.close()
        return;
      })();
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
//DISPLAY=:0