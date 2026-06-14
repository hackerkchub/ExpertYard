import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Seen/Read, Typing, and User Continue Chat Popup automated integration test...');

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
    userPage.on('dialog', async dialog => {
      console.log(`[USER DIALOG] accepting ${dialog.type()}: ${dialog.message()}`);
      await dialog.accept();
    });

    expertPage.on('console', msg => console.log(`[EXPERT CONSOLE] [${msg.type()}] ${msg.text()}`));
    expertPage.on('pageerror', err => console.log(`[EXPERT PAGE ERROR] ${err.toString()}`));
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

    // Let connection register and settle
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ==========================================
    // TEST TYPING STATUS
    // ==========================================
    console.log('\n⌨️ Testing User Typing Status...');
    // User starts typing
    await userPage.focus('textarea, input[placeholder*="Type"]');
    await userPage.keyboard.type('Hello expert');

    console.log('⌛ Waiting for Typing indicator on Expert page...');
    await expertPage.waitForFunction(() => document.body.textContent.includes('typing'), { timeout: 8000 });
    console.log('✓ Expert side successfully displayed User typing status!');

    // Wait for typing timeout to clear status
    console.log('⌛ Waiting for typing status to clear automatically...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const expertShowsTypingPost = await expertPage.evaluate(() => document.body.textContent.includes('typing'));
    if (!expertShowsTypingPost) {
      console.log('✓ User typing status cleared successfully.');
    } else {
      console.warn('⚠️ User typing status did not clear automatically.');
    }

    console.log('\n⌨️ Testing Expert Typing Status...');
    // Expert starts typing
    await expertPage.focus('textarea, input[placeholder*="Type"]');
    await expertPage.keyboard.type('Hello user');

    console.log('⌛ Waiting for Typing indicator on User page...');
    await userPage.waitForFunction(() => document.body.textContent.includes('typing'), { timeout: 8000 });
    console.log('✓ User side successfully displayed Expert typing status!');

    // ==========================================
    // TEST SEEN/READ STATUS
    // ==========================================
    console.log('\n👁️ Testing Message Seen/Read Status...');
    
    // Clear typing inputs and send message
    await userPage.focus('textarea, input[placeholder*="Type"]');
    // Select all and delete
    await userPage.keyboard.down('Control');
    await userPage.keyboard.press('KeyA');
    await userPage.keyboard.up('Control');
    await userPage.keyboard.press('Backspace');
    await userPage.keyboard.type('Test seen status message from user');
    
    // Click send
    console.log('👤 User sending message...');
    await userPage.evaluate(() => {
      const inputEl = document.querySelector('input[placeholder*="Type"]');
      const sendBtn = document.querySelector('input + button');
      console.log('Input value:', inputEl ? `'${inputEl.value}'` : 'not found');
      console.log('Send button found:', !!sendBtn);
      if (sendBtn) {
        console.log('Send button disabled:', sendBtn.disabled);
        sendBtn.click();
      } else {
        throw new Error('User send button not found');
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify User side says "Sent" (not seen yet, since Expert is already on page but let's confirm seen updates in real time)
    // Actually, since Expert is already in the room, it should immediately mark as seen and update User side to "Seen"
    console.log('⌛ Verifying real-time Seen status update on User page...');
    await userPage.waitForFunction(() => document.body.textContent.includes('Seen'), { timeout: 5000 });
    console.log('✓ User side successfully displayed "Seen" status in real time!');

    // Expert sends message to User
    await expertPage.focus('textarea, input[placeholder*="Type"]');
    await expertPage.keyboard.down('Control');
    await expertPage.keyboard.press('KeyA');
    await expertPage.keyboard.up('Control');
    await expertPage.keyboard.press('Backspace');
    await expertPage.keyboard.type('Test seen status message from expert');

    console.log('👨‍🏫 Expert sending message...');
    await expertPage.evaluate(() => {
      const sendBtn = document.querySelector('textarea ~ button:last-of-type');
      if (sendBtn) sendBtn.click();
      else throw new Error('Expert send button not found');
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('⌛ Verifying real-time Seen status update on Expert page...');
    await expertPage.waitForFunction(() => document.body.textContent.includes('Seen'), { timeout: 5000 });
    console.log('✓ Expert side successfully displayed "Seen" status in real time!');

    // Refresh pages and check seen status persistence
    console.log('\n🔄 Refreshing pages to test Seen status persistence...');
    await userPage.reload({ waitUntil: 'domcontentloaded' });
    await userPage.waitForSelector('#end-chat-button', { timeout: 10000 });
    const userPersistedSeen = await userPage.evaluate(() => document.body.textContent.includes('Seen'));
    
    await expertPage.reload({ waitUntil: 'domcontentloaded' });
    await expertPage.waitForSelector('textarea, input[placeholder*="Type"]', { timeout: 10000 });
    const expertPersistedSeen = await expertPage.evaluate(() => document.body.textContent.includes('Seen'));

    if (userPersistedSeen && expertPersistedSeen) {
      console.log('✓ Seen status successfully persisted and reloaded from database on both sides!');
    } else {
      throw new Error(`Seen status did not persist. User: ${userPersistedSeen}, Expert: ${expertPersistedSeen}`);
    }

    // ==========================================
    // TEST USER CONTINUE CHAT POPUP (BACK BUTTON)
    // ==========================================
    console.log('\n🩹 Testing User "Continue Chat" Popup and Back button...');
    
    // User navigates away to /user/wallet
    console.log('👤 User navigating away to /user/wallet...');
    await userPage.goto('http://localhost:5173/user/wallet', { waitUntil: 'domcontentloaded' });
    await userPage.waitForSelector('button', { timeout: 15000 });

    // Verify chat session remains active on Expert side (i.e. did not end)
    console.log('⌛ Verifying session remains active on Expert page...');
    const expertActiveText = await expertPage.evaluate(() => document.body.textContent.includes('Chat ended'));
    if (!expertActiveText) {
      console.log('✓ Chat session is still active! (Did not end automatically on user back button)');
    } else {
      throw new Error('Chat session ended automatically when user navigated away!');
    }

    // Verify continue chat banner is visible on User side
    console.log('⌛ Verifying continue banner visibility on User wallet page...');
    const userBannerVisible = await userPage.evaluate(() => {
      return document.body.textContent.includes('Chat Still Active') || document.body.textContent.includes('Continue');
    });
    if (userBannerVisible) {
      console.log('✓ "Continue Chat" banner is visible for User!');
    } else {
      throw new Error('Continue Chat banner not visible for User on wallet page!');
    }

    // Click Continue on User side
    console.log('👤 User clicking Continue...');
    await userPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const contBtn = btns.find(b => b.textContent.includes('Continue'));
      if (contBtn) contBtn.click();
    });

    // Verify redirection
    console.log('⌛ Verifying user redirection back to chat room...');
    await userPage.waitForFunction(() => window.location.pathname === '/user/chat/test_room_123', { timeout: 10000 });
    console.log('✓ Redirected user back to the active chat room successfully!');

    // Clean up: End chat session
    console.log('\n🧼 Cleaning up: User ending the chat...');
    await userPage.waitForSelector('#end-chat-button', { timeout: 15000 });
    await userPage.click('#end-chat-button');
    await new Promise(resolve => setTimeout(resolve, 3000));

    testSuccess = true;
    console.log('\n⭐⭐⭐⭐⭐ ALL CHAT INTEGRATION TESTS PASSED SUCCESSFULLY! ⭐⭐⭐⭐⭐\n');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
  } finally {
    if (userBrowser) await userBrowser.close();
    if (expertBrowser) await expertBrowser.close();
    process.exit(testSuccess ? 0 : 1);
  }
})();
