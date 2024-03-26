import * as cheerio from "cheerio";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { exportToExcel } from "../service/exportExcel.js";

export async function searchGoogleMaps(stringFromUser) {
    try {
      const start = Date.now();
  
      puppeteerExtra.use(stealthPlugin());
  
      const browser = await puppeteerExtra.launch({
        headless: false,
        // headless: "new",
        // devtools: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      });
  
      const page = await browser.newPage();
  
      const query = stringFromUser;
  
      try {
        await page.goto(
          `https://www.google.com/maps/search/${query.split(" ").join("+")}`
        );
      } catch (error) {
        console.log("error going to page");
      }
  
      async function autoScroll(page) {
        await page.evaluate(async () => {
          const wrapper = document.querySelector('div[role="feed"]');
  
          await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 1000;
            var scrollDelay = 3000;
  
            var timer = setInterval(async () => {
              var scrollHeightBefore = wrapper.scrollHeight;
              wrapper.scrollBy(0, distance);
              totalHeight += distance;
  
              if (totalHeight >= scrollHeightBefore) {
                totalHeight = 0;
                await new Promise((resolve) => setTimeout(resolve, scrollDelay));
  
                // Calculate scrollHeight after waiting
                var scrollHeightAfter = wrapper.scrollHeight;
  
                if (scrollHeightAfter > scrollHeightBefore) {
                  // More content loaded, keep scrolling
                  return;
                } else {
                  // No more content loaded, stop scrolling
                  clearInterval(timer);
                  resolve();
                }
              }
            }, 200);
          });
        });
      }
  
      console.log("🗄️ Sedang dalam proses pengambilan data, harap tunggu...");
      await autoScroll(page);
  
      const html = await page.content();
      const pages = await browser.pages();
  
      await Promise.all(
        pages.map(async (page) => {
          try {
            await page.close();
          } catch (error) {
            console.error("Error closing page:", error);
          }
        })
      );
  
      if (browser && browser.isConnected()) {
        try {
          await browser.close();
          console.log("Proses berakhir...");
        } catch (error) {
          console.error("Failed to close browser:", error);
        }
      } else {
        console.log("Browser process is not running or already closed.");
      }
  
      // get all a tag parent where a tag href includes /maps/place/
      const $ = cheerio.load(html);
      const aTags = $("a");
      const parents = [];
      aTags.each((i, el) => {
        const href = $(el).attr("href");
        if (!href) {
          return;
        }
        if (href.includes("/maps/place/")) {
          parents.push($(el).parent());
        }
      });
  
      console.log("🗂️ Banyaknya item: ", parents.length);
  
      const buisnesses = [];
  
      parents.forEach((parent) => {
        const url = parent.find("a").attr("href");
        // get a tag where data-value="Website"
        const website = parent.find('a[data-value="Website"]').attr("href");
        // find a div that includes the class fontHeadlineSmall
        const storeName = parent.find("div.fontHeadlineSmall").text();
        // find span that includes class fontBodyMedium
        const ratingText = parent
          .find("span.fontBodyMedium > span")
          .attr("aria-label");
  
        // get the first div that includes the class fontBodyMedium
        const bodyDiv = parent.find("div.fontBodyMedium").first();
        const children = bodyDiv.children();
        const lastChild = children.last();
        const firstOfLast = lastChild.children().first();
        const lastOfLast = lastChild.children().last();
  
        buisnesses.push({
          placeId: `ChI${url?.split("?")?.[0]?.split("ChI")?.[1]}`,
          address: firstOfLast?.text()?.split("·")?.[1]?.trim(),
          category: firstOfLast?.text()?.split("·")?.[0]?.trim(),
          phone: lastOfLast?.text()?.split("·")?.[1]?.trim(),
          googleUrl: url,
          bizWebsite: website,
          storeName,
          ratingText,
        });
      });
      const end = Date.now();
  
      const today = new Date();
      const dateString = today.toISOString();
  
      const fileName = await exportToExcel(buisnesses, dateString, query);
      console.log(`🔥 Data berhasil disimpan dengan nama: ${fileName}`);
  
      console.log(
        `⌛ Di eksekusi dalam ${Math.floor((end - start) / 1000)} detik`
      );
      //return buisnesses;
      return;
    } catch (error) {
      console.log("Error: ", error.message);
    }
  }
