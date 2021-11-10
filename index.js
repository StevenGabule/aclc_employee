const moment = require('moment');
const puppeteer = require('puppeteer');
const log = require('./log.js');
const { setIntervalAsync } = require('set-interval-async/fixed');

const schedule = [
  {
    sunday: [
      {
        time: '10:00 AM',
        subject: 'ITME2-BSIT-3WK',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '3:10 PM',
        subject: 'ITME2-BSIT-3WK|WEB-DESIGN-BSBA-3WK',
        type: 'LOGOUT-LOGIN',
        reLogin: true,
      },
      {
        time: '8:10 PM',
        subject: 'WEB-DESIGN-BSBA-3WK',
        type: 'LOGOUT',
        reLogin: false,
      },
    ],
  },
  {
    monday: [
      {
        time: '8:00 AM',
        subject: 'WEB-DESIGN-BSBA-3C',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '11:10 AM',
        subject: 'WEB-DESIGN-BSBA-3C',
        type: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '12:30 PM',
        subject: 'WEB-DESIGN-BSBA-3A',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '2:40 PM',
        subject: 'WEB-DESIGN-BSBA-3A',
        TYPE: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '3:00 PM',
        subject: 'ITME3-BSIT-4A',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '8:10 PM',
        subject: 'ITME3-BSIT-4A',
        type: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '8:30 PM',
        subject: 'WEB-DESIGN-BSBA-3NA',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '10:10 PM',
        subject: 'WEB-DESIGN-BSBA-3NA',
        type: 'LOGOUT',
        reLogin: false,
      },
    ],
  },
  {
    tuesday: [
      {
        time: '8:00 AM',
        subject: 'WEB-DESIGN-BSBA-3B|C',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '1:10 PM',
        subject: 'WEB-DESIGN-BSBA-3C|B',
        type: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '5:00 PM',
        subject: 'COMPR1-BSIT-1NA',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '8:10 PM',
        subject: 'COMPR1-BSIT-1NA',
        type: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '8:30 PM',
        subject: 'WEB-DESIGN-BSBA-3NA',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '10:10 PM',
        subject: 'WEB-DESIGN-BSBA-3NA',
        type: 'LOGOUT',
        reLogin: false,
      },
    ],
  },
  {
    wednesday: [
      {
        time: '8:00 AM',
        subject: 'WEB-DESIGN-BSBA-3A',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '11:00 PM',
        subject: 'WEB-DESIGN-BSBA-3A|3C',
        type: 'LOGOUT-LOGIN',
        reLogin: true,
      },
      {
        time: '1:10 PM',
        subject: 'WEB-DESIGN-BSBA-3C',
        type: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '2:00 PM',
        subject: 'ITME2-BSIT-3B',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '7:10 PM',
        subject: 'ITME2-BSIT-3B',
        type: 'LOGOUT',
        reLogin: false,
      },
    ],
  },
  {
    thursday: [
      {
        time: '5:00 PM',
        subject: 'COMPR1-BSIT-1N',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '7:10 PM',
        subject: 'COMPR1-BSIT-1N',
        type: 'LOGOUT',
        reLogin: false,
      },
      {
        time: '8:00 PM',
        subject: 'WEB-DESIGN-BSBA-3NA',
        type: 'LOGIN',
        reLogin: false,
      },
      {
        time: '10:10 PM',
        subject: 'WEB-DESIGN-BSBA-3NA',
        type: 'LOGOUT',
        reLogin: false,
      },
    ],
  },
];

var prevTime = '';
async function portalScrap() {
  async function main() {
    let timeToday = moment().format('LT');
    let today = moment().format('dddd').toLowerCase();
    if (timeToday !== prevTime) {
      prevTime = timeToday;
      console.log(`Date information: ${today}, ${timeToday}`);
      let iterator = schedule.entries();
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
}

setIntervalAsync(async () => {
  await portalScrap();
}, 10000);
