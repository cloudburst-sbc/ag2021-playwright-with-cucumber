/**
 * Steps for a chat app, from the 2021 Automation Guild session:
 * Set the Stage with Playwright and CucumberJS
 * 
 * @author Sonja Q. Leaf <sonja.leaf@cloudburststudio.com>
 */
const { Given, When, Then, After, Before, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
const faker = require('faker');

/**
 * Set the default timeout of Cucumber to 30 seconds
 */
setDefaultTimeout(30 * 1000);

/**
 * a chat invite url from https://yap.chat
 */
const CHAT_URL = "";

/**
 * Before all steps, on each test run, create a Playwright Browser 
 * and assign it to `this.browser` so it can be used in other steps.
 *
 */
Before(async function () {
    const options = {
        headless: false // To show the browser
    }

    const browser = await playwright.chromium.launch(options);

    this.browser = browser;
})

/**
 * A Regular expression that creates a new browser object for an actor
 * 
 */
Given(/(ActorA|ActorB)'s browser/, async function (actorName) {
    // Use the faker library to bring in unique names and text strings
    const actorDetails = {
        name: faker.name.firstName(),
        message: faker.lorem.sentence()
    }
    
    this[actorName] = actorDetails;
    
    // Create a new context to use for this Actor - this is separate
    // from any other Actor's contexts. No shared resources at all, 
    // other than the browser runner.
    const context = await this.browser.newContext();
    const page = await context.newPage();

    this[actorName].page = page;

});

/**
 * Uses CSS locators to fill in a username and press submit
 */
When(/(ActorA|ActorB) joins the chat group/, async function (actorName) {
    const page = this[actorName].page;
    await page.goto(CHAT_URL);
    await page.fill('input[id="username"]', this[actorName].name);
    await page.click('button[type="submit"]');
});

/**
 * A debug step that will let your browser set for 300 seconds
 * while you look at what's next.
 */
When('debug here', { timeout: 300000 }, async function () {
    console.log('DEBUG');
    await new Promise( r => setTimeout(r, 300000))
})

/**
 * Use CSS to fill in and submit a message
 */
Then(/(ActorA|ActorB) can send a message/, async function (actorName) {
    const page = this[actorName].page;
    await page.fill('textarea[id="userInput"]', this[actorName].message);
    await page.press('textarea[id="userInput"]', "Enter");
});


/**
 * Use the xpath selector engine to verify text content is on screen
 */
Then(/(ActorA|ActorB) can see (ActorA|ActorB)'s message/, async function (actorOne, actorTwo) {
    const page = this[actorOne].page;

    await page.waitForSelector(
        `xpath=//div//*[contains(.,"${this[actorTwo].name}") and contains(.,"${this[actorTwo].message}")]`
    );

})

/**
 * Close the browser
 */
After(async function () {
    await this.browser.close();
})