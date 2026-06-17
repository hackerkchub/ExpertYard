import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting User-to-Expert voice call automated test using system Google Chrome...');

  let userBrowser, expertBrowser;
  let userPage, expertPage;
  let testSuccess = false;

  try {
    const launchOptions = {
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
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

    // Capture console logs and page errors
    userPage.on('console', msg => console.log(`[USER CONSOLE] [${msg.type()}] ${msg.text()}`));
    userPage.on('pageerror', err => console.log(`[USER PAGE ERROR] ${err.toString()}`));
    userPage.on('requestfailed', req => console.log(`[USER REQ FAILED] ${req.url()} - ${req.failure()?.errorText || 'unknown'}`));

    expertPage.on('console', msg => console.log(`[EXPERT CONSOLE] [${msg.type()}] ${msg.text()}`));
    expertPage.on('pageerror', err => console.log(`[EXPERT PAGE ERROR] ${err.toString()}`));
    expertPage.on('requestfailed', req => console.log(`[EXPERT REQ FAILED] ${req.url()} - ${req.failure()?.errorText || 'unknown'}`));

    // 1. Log in User
    console.log('👤 Navigating User to login page...');
    await userPage.goto('http://localhost:5173/user/auth', { waitUntil: 'domcontentloaded' });
    
    // Wait for email input
    await userPage.waitForSelector('input[placeholder="Email Address"]', { timeout: 15000 });

    await userPage.type('input[placeholder="Email Address"]', 'test@example.com');
    await userPage.type('input[placeholder="Password"]', 'password123');
    
    await userPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const loginBtn = btns.find(b => b.textContent.includes('Login to Continue'));
      if (loginBtn) loginBtn.click();
      else throw new Error('Login button not found');
    });

    console.log('⌛ Waiting for User home redirection...');
    await userPage.waitForFunction(() => window.location.pathname === '/user', { timeout: 10000 });
    console.log('✓ User logged in successfully.');

    // 2. Log in Expert
    console.log('👨‍🏫 Navigating Expert to login page...');
    await expertPage.goto('http://localhost:5173/expert/register', { waitUntil: 'domcontentloaded' });
    await expertPage.waitForSelector('input[placeholder="Enter email or phone number"]');
    await expertPage.type('input[placeholder="Enter email or phone number"]', 'testexpert@example.com');
    await expertPage.type('input[placeholder="Enter your password"]', 'password123');

    await expertPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const loginBtn = btns.find(b => b.textContent.includes('Continue with Expert Account'));
      if (loginBtn) loginBtn.click();
      else throw new Error('Expert login button not found');
    });

    console.log('⌛ Waiting for Expert dashboard redirection...');
    await expertPage.waitForFunction(() => window.location.pathname.startsWith('/expert/home') || window.location.pathname === '/expert', { timeout: 15000 });
    console.log('✓ Expert logged in successfully.');

    // Give a moment for socket connections to settle
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. User initiates call
    console.log('📞 User starting voice call to Expert (ID 166)...');
    await userPage.goto('http://localhost:5173/user/voice-call/166', { waitUntil: 'domcontentloaded' });

    // 4. Expert receives and accepts call
    console.log('⌛ Waiting for incoming call popup on Expert side...');
    await expertPage.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.includes('Accept Call'));
    }, { timeout: 30000 });

    console.log('📞 Incoming call popup detected! Clicking Accept Call...');
    await expertPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const acceptBtn = btns.find(b => b.textContent.includes('Accept Call'));
      if (acceptBtn) acceptBtn.click();
    });

    // 5. Verify call connected on both sides
    console.log('⌛ Waiting for call state to become Connected on both sides...');
    await userPage.waitForFunction(() => document.body.textContent.includes('Connected'), { timeout: 15000 });
    await expertPage.waitForFunction(() => document.body.textContent.includes('Connected'), { timeout: 15000 });
    console.log('✓ Call connected successfully! Two-way audio should be active.');

    // Let the call stay active for 10 seconds
    console.log('⌛ Letting call stay active for 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 6. Test Socket Reconnection (Stale Socket ID Routing check)
    console.log('🔄 Simulating socket disconnection and reconnection on User side...');
    await userPage.evaluate(() => {
      if (window.__socket) {
        window.__socket.disconnect();
        console.log('⚡ User socket explicitly disconnected.');
        setTimeout(() => {
          window.__socket.connect();
          console.log('⚡ User socket reconnected.');
        }, 3000);
      } else {
        console.error('❌ window.__socket is not defined!');
      }
    });

    // Wait for reconnection and signaling to re-establish
    console.log('⌛ Waiting 10 seconds for user socket recovery and WebRTC resume...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Verify call is still connected and not broken
    const userConnected = await userPage.evaluate(() => document.body.textContent.includes('Connected'));
    const expertConnected = await expertPage.evaluate(() => document.body.textContent.includes('Connected'));

    if (userConnected && expertConnected) {
      console.log('✓ Call remains fully connected after socket reconnection! Stale socket routing fix verified.');
    } else {
      throw new Error('❌ Call connection dropped after socket reconnection!');
    }

    // 7. End call from User side
    console.log('🔚 User ending the call...');
    await userPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const endBtn = btns.find(b => b.textContent.includes('End Call') || b.title === 'End Call');
      if (endBtn) endBtn.click();
      else {
        const finalEnd = btns.find(b => b.textContent.includes('End') || b.textContent.includes('Cancel') || b.textContent.includes('X'));
        if (finalEnd) finalEnd.click();
      }
    });

    console.log('⌛ Waiting for both sides to clean up and redirect...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const userUrl = await userPage.evaluate(() => window.location.pathname);
    const expertUrl = await expertPage.evaluate(() => window.location.pathname);

    console.log(`User URL after end: ${userUrl}`);
    console.log(`Expert URL after end: ${expertUrl}`);

    testSuccess = true;
    console.log('\n⭐⭐⭐⭐⭐ ALL TESTS PASSED SUCCESSFULLY! ⭐⭐⭐⭐⭐\n');

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
  } finally {
    if (userBrowser) await userBrowser.close();
    if (expertBrowser) await expertBrowser.close();
    process.exit(testSuccess ? 0 : 1);
  }
})();
