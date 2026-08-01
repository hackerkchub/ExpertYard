import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting User-to-Expert VIDEO call automated test using system Google Chrome...');

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

    userPage.on('console', msg => console.log(`[USER CONSOLE] [${msg.type()}] ${msg.text()}`));
    userPage.on('pageerror', err => console.log(`[USER PAGE ERROR] ${err.toString()}`));

    expertPage.on('console', msg => console.log(`[EXPERT CONSOLE] [${msg.type()}] ${msg.text()}`));
    expertPage.on('pageerror', err => console.log(`[EXPERT PAGE ERROR] ${err.toString()}`));

    // 1. Log in User via API
    console.log('👤 Logging in User via API...');
    await userPage.goto('http://localhost:5173/user/auth', { waitUntil: 'domcontentloaded' });
    const userLoggedIn = await userPage.evaluate(async () => {
      const res = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      });
      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    });

    if (!userLoggedIn) throw new Error('User API login failed');
    await userPage.goto('http://localhost:5173/user', { waitUntil: 'domcontentloaded' });
    console.log('✓ User logged in successfully.');

    // 2. Log in Expert via API
    console.log('👨‍🏫 Logging in Expert via API...');
    await expertPage.goto('http://localhost:5173/expert/home', { waitUntil: 'domcontentloaded' });
    const expertLoggedIn = await expertPage.evaluate(async () => {
      const res = await fetch('http://localhost:5000/api/expert/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_or_phone: 'testexpert@example.com', password: 'password123' })
      });
      const data = await res.json();
      if (data.token && data.expert) {
        localStorage.setItem('expert_token', data.token);
        localStorage.setItem('expert_session', JSON.stringify({
          expertId: data.expert.id,
          name: data.expert.name,
          email: data.expert.email,
          phone: data.expert.phone,
          is_subscribed: data.expert.is_subscribed,
          subscription_status: data.expert.subscription_status || 'free',
          access_level: data.expert.access_level || 'free_limited',
          can_view_contact: Boolean(data.expert.can_view_contact),
          can_chat: Boolean(data.expert.can_chat),
          can_call: Boolean(data.expert.can_call),
        }));
        localStorage.setItem('last_panel', 'expert');
        return true;
      }
      return false;
    });

    if (!expertLoggedIn) throw new Error('Expert API login failed');
    await expertPage.goto('http://localhost:5173/expert/home', { waitUntil: 'domcontentloaded' });
    console.log('✓ Expert logged in successfully.');

    // Settle socket connections
    await new Promise(resolve => setTimeout(resolve, 3000));

    const expertId = 166;

    // 3. User initiates video call
    console.log(`📹 User starting VIDEO call to Expert (ID ${expertId})...`);
    await userPage.goto(`http://localhost:5173/user/video-call/${expertId}`, { waitUntil: 'domcontentloaded' });

    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const uText = await userPage.evaluate(() => document.body.innerText);
      const eText = await expertPage.evaluate(() => document.body.innerText);
      console.log(`--- [Second ${i}] ---`);
      console.log(`User page text: "${uText.replace(/\n+/g, ' | ').slice(0, 150)}"`);
      console.log(`Expert page text: "${eText.replace(/\n+/g, ' | ').slice(0, 150)}"`);

      const hasAccept = await expertPage.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.some(b => b.textContent.includes('Accept Call'));
      });
      if (hasAccept) {
        console.log('🎉 FOUND Accept Call button on Expert side!');
        break;
      }
    }

    // 4. Expert accepts call
    console.log('📹 Clicking Accept Call on Expert side...');
    await expertPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const acceptBtn = btns.find(b => b.textContent.includes('Accept Call'));
      if (acceptBtn) acceptBtn.click();
      else throw new Error('Accept Call button not found');
    });

    // 5. Verify video call connected on both sides
    console.log('⌛ Waiting for video call state to become Connected on both sides...');
    await userPage.waitForFunction(() => {
      return window.location.pathname.includes('/user/video-call') && !document.body.textContent.includes('Ringing') && !document.body.textContent.includes('failed');
    }, { timeout: 15000 });

    await expertPage.waitForFunction(() => {
      return window.location.pathname.includes('/expert/video-call');
    }, { timeout: 15000 });

    console.log('✓ Video call connected successfully on both sides!');

    // Let call stay active for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 6. End call from User side
    console.log('🔚 User ending the video call...');
    await userPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const endBtn = btns.find(b => b.title === 'End Call' || b.ariaLabel === 'End Call' || b.textContent.includes('End'));
      if (endBtn) endBtn.click();
    });

    console.log('⌛ Waiting for cleanup and redirection...');
    await new Promise(resolve => setTimeout(resolve, 4000));

    testSuccess = true;
    console.log('\n⭐⭐⭐⭐⭐ VIDEO CALL TEST PASSED SUCCESSFULLY! ⭐⭐⭐⭐⭐\n');

  } catch (error) {
    console.error('\n❌ Video call test failed:', error.message);
  } finally {
    if (userBrowser) await userBrowser.close();
    if (expertBrowser) await expertBrowser.close();
    process.exit(testSuccess ? 0 : 1);
  }
})();
