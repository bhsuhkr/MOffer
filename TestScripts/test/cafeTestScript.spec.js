const { By, Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require("assert");
const sql = require("mssql/msnodesqlv8");

var driver;

// load configuration settings
let config = require("../config.js");

console.log("config env: " + config.NODE_ENV);
console.log("config db: " + config.connectionString);

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

(async function testCafeTransactions() {

  try {
    // configurate chrome behaviors
    let options = new chrome.Options();
    options.setAlertBehavior('accept');

    // load chrome browser
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().setTimeouts({ implicit: 500 });

    // invoke the login page via URL
    await driver.get(config.appURL);
    await driver.sleep(300);

    let title = await driver.getTitle();
    assert.equal(title, "M Offer");

    // login
    let loginElement = await driver.findElement(By.id('username'));
    let pwdElement = await driver.findElement(By.id('password'));
    let submitButton = await driver.findElement(By.id('loginButton'));
    await loginElement.sendKeys(config.appLoginName);
    await pwdElement.sendKeys(config.appLoginPwd);
    await submitButton.click();
    await driver.sleep(300);


    // navigate to cafe pay test
    await driver.get(config.appURL + config.appUriCafe);
    await driver.sleep(300);

    title = await driver.getTitle();
    assert.equal(title, "M Offer");

    // enter 2 coffees then remove both
    let itemElement = await driver.findElement(By.id('barcodeInput'));
    submitButton = await driver.findElement(By.id('cashButton'));

    for (index = 0; index < parseInt(config.testItemMax); index++) {
      await itemElement.sendKeys("COFFEE\n");
      await driver.sleep(100);
    }

    for (index = parseInt(config.testItemMax) - 1; index >= 0; index--) {
      itemElement = await driver.findElement(By.id('item' + index));
      await itemElement.click();
    }

    // due to missing items, it will error out
    await submitButton.click();
    driver.sleep(300);

    itemElement = await driver.findElement(By.id("validationMsg"));
    let value = await itemElement.getText();
    // check error message
    assert.equal(value, "지불할 아이템이 없습니다.");

    // add items and remove 1, total of $3.00
    itemElement = await driver.findElement(By.id('barcodeInput'));
    submitButton = await driver.findElement(By.id('cashButton'));

    for (index = 0; index < parseInt(config.testItemMax); index++) {
      await itemElement.sendKeys("COFFEE\n");
      await driver.sleep(100);
    }

    // remove 1
    itemElement = await driver.findElement(By.id('item0'));
    await itemElement.click();

    // click pay with cash button
    await submitButton.click();
    driver.sleep(300);

    itemElement = await driver.findElement(By.id("cafePopupTotal"));
    value = await itemElement.getText();
    assert.equal(value, "Total: " +
      USDollar.format(parseFloat(config.testItemCost) * (parseInt(config.testItemMax) - 1)));

    submitButton = await driver.findElement(By.id('makePayment'));
    await submitButton.click();
    await driver.sleep(300);

    itemElement = await driver.findElement(By.id("cafePopupTotal"));
    value = await itemElement.getText();
    assert.equal(value, "Total: " +
      USDollar.format(parseFloat(config.testItemCost) * (parseInt(config.testItemMax) - 1)));

    submitButton = await driver.findElement(By.id('paidConfirmation'));
    await submitButton.click();
    await driver.sleep(300);

  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}())
