const moment = require('moment');
const puppeteer = require('puppeteer');

const schedule = [
  {
    sunday: [
      { time: '10:00 AM', subject: 'ITME2-BSIT-3WK-LOGIN', reLogin: false },
      {
        time: '3:00 PM',
        subject: 'WEB-DESIGN-BSBA-3WK-LOGOUT-LOGIN',
        reLogin: true,
      },
      {
        time: '8:00 PM',
        subject: 'WEB-DESIGN-BSBA-3WK-LOGOUT',
        reLogin: false,
      },
    ],
  },
  {
    monday: [
      { time: '8:00 AM', subject: 'ITME2-BSIT-3WK', reLogin: false },
      { time: '3:00 PM', subject: 'ITME2-BSIT-3WK', reLogin: true },
    ],
  },
];

async function portalScrap() {
  async function main() {
    let timeToday = moment().format('LT');
    const today = moment().format('dddd').toLowerCase();
    const iterator = schedule.entries();
    for (let e of iterator) {
      if (e[1][today]) {
        const res = e[1][today].find((sched) => sched.time === timeToday);
        if (res) {
          await proceed(res.reLogin);
          console.table([res]);
        }
      }
    }
  }

  async function proceed(reLogin) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // login
    await page.goto('https://www.aclcbukidnon.com/employees');
    await page.screenshot({ path: 'login.png' });
    await page.type('[id=ContentPlaceHolder1_txtEmployyeID]', 'username');
    await page.type(
      '[id=ContentPlaceHolder1_txtPassword]',
      'password400dollar'
    );
    await page.click('[type=submit]');
    await page.waitForTimeout(5000);

    // Click the clock-in/clock-out button
    await page.goto('https://www.aclcbukidnon.com/Employees/CLOCKIN_CLOCKOUT');
    await page.click('[id=ContentPlaceHolder1_btnClock]');
    await page.waitForTimeout(2000);

    await page.click('[id=ContentPlaceHolder1_modalClose]');

    if (reLogin) {
      await page.goto(
        'https://www.aclcbukidnon.com/Employees/CLOCKIN_CLOCKOUT'
      );
      await page.click('[id=ContentPlaceHolder1_btnClock]');
      await browser.close();
    } else {
      await browser.close();
    }
  }

  await main();
  setTimeout(async () => {
    await main();
  }, 20000); // 2 minutes
}

(async () => {
  await portalScrap();
})();
