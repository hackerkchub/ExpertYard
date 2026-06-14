import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting "Continue Active Chat" popup automated test with logging...');

  let userBrowser, expertBrowser;
  let userPage, expertPage;
  let testSuccess = false;

  try {
    const launchOptions = {
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    };

    console.log('🌐 Launching User Browser...');
    userBrowser = await puppeteer.launch(launchOptions);

    console.log('🌐 Launching Expert Browser...');
    expertBrowser = await puppeteer.launch(launchOptions);

    userPage = await userBrowser.newPage();
    expertPage = await expertBrowser.newPage();

    userPage.on('console', msg => console.log(`[USER CONSOLE] [${msg.type()}] ${msg.text()}`));
    userPage.on('pageerror', err => console.log(`[USER PAGE ERROR] ${err.toString()}`));
    userPage.on('requestfailed', req => console.log(`[USER REQ FAILED] ${req.url()} - ${req.failure()?.errorText || 'unknown'}`));
    userPage.on('dialog', async dialog => {
      console.log(`[USER DIALOG] accepting ${dialog.type()}: ${dialog.message()}`);
      await dialog.accept();
    });

    expertPage.on('console', msg => console.log(`[EXPERT CONSOLE] [${msg.type()}] ${msg.text()}`));
    expertPage.on('pageerror', err => console.log(`[EXPERT PAGE ERROR] ${err.toString()}`));
    expertPage.on('requestfailed', req => console.log(`[EXPERT REQ FAILED] ${req.url()} - ${req.failure()?.errorText || 'unknown'}`));
    expertPage.on('dialog', async dialog => {
      console.log(`[EXPERT DIALOG] accepting ${dialog.type()}: ${dialog.message()}`);
      await dialog.accept();
    });

    // 1. Log in User
    console.log('👤 Logging in User...');
    await userPage.goto('http://localhost:5173/user/auth', { waitUntil: 'domcontentloaded' });
    await userPage.waitForSelector('input[placeholder="Email Address"]', { timeout: 15000 });
    await userPage.type('input[placeholder="Email Address"]', 'test@example.com');
    await userPage.type('input[placeholder="Password"]', 'password123');
    await userPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const loginBtn = btns.find(b => b.textContent.includes('Login to Continue'));
      if (loginBtn) loginBtn.click();
    });
    await userPage.waitForFunction(() => window.location.pathname === '/user', { timeout: 10000 });
    console.log('✓ User logged in.');

    // 2. Log in Expert
    console.log('👨‍🏫 Logging in Expert...');
    await expertPage.goto('http://localhost:5173/expert/register', { waitUntil: 'domcontentloaded' });
    await expertPage.waitForSelector('input[placeholder="Enter email or phone number"]', { timeout: 15000 });
    await expertPage.type('input[placeholder="Enter email or phone number"]', 'dhotehimanshu87@gmail.com');
    await expertPage.type('input[placeholder="Enter your password"]', 'password123');
    await expertPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const loginBtn = btns.find(b => b.textContent.includes('Continue with Expert Account'));
      if (loginBtn) loginBtn.click();
    });
    await expertPage.waitForFunction(() => window.location.pathname.startsWith('/expert/home') || window.location.pathname === '/expert', { timeout: 15000 });
    console.log('✓ Expert logged in.');

    // 3. Join chat room on both sides
    console.log('💬 User joining test_room_123...');
    await userPage.goto('http://localhost:5173/user/chat/test_room_123', { waitUntil: 'domcontentloaded' });
    await userPage.waitForSelector('textarea, input[placeholder*="Type"]', { timeout: 15000 });

    console.log('💬 Expert joining test_room_123...');
    await expertPage.goto('http://localhost:5173/expert/chat/test_room_123', { waitUntil: 'domcontentloaded' });
    await expertPage.waitForSelector('textarea, input[placeholder*="Type"]', { timeout: 15000 });
    console.log('✓ Both joined the chat room.');

    // Let the chat session state initialize and register
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Navigate away
    console.log('👤 User navigating away to /user/wallet...');
    await userPage.goto('http://localhost:5173/user/wallet', { waitUntil: 'domcontentloaded' });
    await userPage.waitForSelector('button', { timeout: 15000 });

    console.log('👨‍🏫 Expert navigating away to /expert/settings...');
    await expertPage.goto('http://localhost:5173/expert/settings', { waitUntil: 'domcontentloaded' });
    await expertPage.waitForSelector('button', { timeout: 15000 });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Verify banner is visible
    console.log('⌛ Verifying popup/banner visibility...');
    const userBannerVisible = await userPage.evaluate(() => {
      return document.body.textContent.includes('Chat Still Active') || document.body.textContent.includes('Continue');
    });
    const expertBannerVisible = await expertPage.evaluate(() => {
      return document.body.textContent.includes('Active Chat Open') || document.body.textContent.includes('Continue');
    });

    if (userBannerVisible && expertBannerVisible) {
      console.log('✓ "Continue Chat" banner is visible on other pages for both User and Expert!');
    } else {
      throw new Error(`Banner not visible. User: ${userBannerVisible}, Expert: ${expertBannerVisible}`);
    }

    // 6. Click Continue button
    console.log('👤 User clicking Continue...');
    await userPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const contBtn = btns.find(b => b.textContent.includes('Continue'));
      if (contBtn) contBtn.click();
    });

    console.log('👨‍🏫 Expert clicking Continue...');
    await expertPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const contBtn = btns.find(b => b.textContent.includes('Continue'));
      if (contBtn) contBtn.click();
    });

    // Verify redirection
    console.log('⌛ Verifying redirection back to chat...');
    await userPage.waitForFunction(() => window.location.pathname === '/user/chat/test_room_123', { timeout: 10000 });
    await expertPage.waitForFunction(() => window.location.pathname === '/expert/chat/test_room_123', { timeout: 10000 });
    console.log('✓ Redirected back to the active chat room successfully!');

    // 7. End chat session
    console.log('👤 User ending the chat...');
    await userPage.waitForSelector('#end-chat-button', { timeout: 15000 });
    await userPage.click('#end-chat-button');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify banner is hidden
    console.log('⌛ Verifying banner is hidden after chat ends...');
    await userPage.goto('http://localhost:5173/user/wallet', { waitUntil: 'domcontentloaded' });
    await expertPage.goto('http://localhost:5173/expert/home', { waitUntil: 'domcontentloaded' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userBannerVisiblePost = await userPage.evaluate(() => {
      return document.body.textContent.includes('Chat Still Active');
    });
    const expertBannerVisiblePost = await expertPage.evaluate(() => {
      return document.body.textContent.includes('Active Chat Open');
    });

    if (!userBannerVisiblePost && !expertBannerVisiblePost) {
      console.log('✓ Banner successfully removed and hidden after chat session ended.');
    } else {
      throw new Error(`Banner still visible after chat ended. User: ${userBannerVisiblePost}, Expert: ${expertBannerVisiblePost}`);
    }

    testSuccess = true;
    console.log('\n⭐⭐⭐⭐⭐ ALL POPUP TESTS PASSED SUCCESSFULLY! ⭐⭐⭐⭐⭐\n');

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
  } finally {
    if (userBrowser) await userBrowser.close();
    if (expertBrowser) await expertBrowser.close();
    process.exit(testSuccess ? 0 : 1);
  }
})();
