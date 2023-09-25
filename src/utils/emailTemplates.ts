const year = new Date().getFullYear();

export const steppingStonesConfirmTemplate = (verifyCode: string) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

  <head data-id="__react-email-head">
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671618/SS_Color_logo_with-background2_b2zdqb.webp" />
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Verify your email address<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body data-id="__react-email-body" style="background-color:#ffffff;margin:0 auto;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif">
    <table align="center" width="100%" data-id="__react-email-container" role="presentation" cellSpacing="0" cellPadding="0" border="0" style="max-width:600px;margin:0 auto">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" data-id="react-email-section" style="margin-top:32px" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><img data-id="react-email-img" alt="SteppingStones" src="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671618/SS_Color_logo_with-background2_b2zdqb.webp" width="200" height="40" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                </tr>
              </tbody>
            </table>
            <h1 data-id="react-email-heading" style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Verify your email address</h1>
            <p data-id="react-email-text" style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Your one-time code is below - enter it in your browser window to get signed in.</p>
            <table align="center" width="100%" data-id="react-email-section" style="background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p data-id="react-email-text" style="font-size:30px;line-height:24px;margin:16px 0;text-align:center;vertical-align:middle">${verifyCode}</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <p data-id="react-email-text" style="font-size:14px;line-height:24px;margin:16px 0;color:#000">If you didn&#x27;t request this email, there&#x27;s nothing to worry about - you can safely delete it.</p>
            <table align="center" width="100%" data-id="react-email-section" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" data-id="react-email-row" style="margin-bottom:32px;padding-left:8px;padding-right:8px;width:100%" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column" style="width:66%"><img data-id="react-email-img" alt="SteppingStones" src="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671618/SS_Color_logo_with-background2_b2zdqb.webp" width="200" height="40" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                          <td data-id="__react-email-column">
                            <table align="center" width="100%" data-id="react-email-row" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                              <tbody style="width:100%">
                                <tr style="width:100%">
                                  <td data-id="__react-email-column"><a href="https://twitter.com" data-id="react-email-link" target="_blank" style="color:#067df7;text-decoration:none"><img data-id="react-email-img" alt="Slack" src="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" width="24" height="24" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:62px" /></a></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" data-id="react-email-section" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><a href="https://steppingstonesapp.com/about" rel="noopener noreferrer" data-id="react-email-link" target="_blank" style="color:#b7b7b7;text-decoration:underline">About</a>   |   <a href="https://steppingstonesapp.com/#features" rel="noopener noreferrer" data-id="react-email-link" target="_blank" style="color:#b7b7b7;text-decoration:underline">Features</a>   |   <a href="https://steppingstonesapp.com/#faqs" rel="noopener noreferrer" data-id="react-email-link" target="_blank" style="color:#b7b7b7;text-decoration:underline">FAQs</a>
                    <p data-id="react-email-text" style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">Stepping Stones App<sup>©</sup> is the copyright and product of <a href="https://www.buildwithequilibrium.com" data-id="react-email-link" target="_blank" style="color:#8898aa;text-decoration:none">Equilibrium Startup Lab LLC</a> ${year}<br />All rights reserved.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
  `;
};

export const verifyEmailTemplate = (name: string, url: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="margin: 0; height: 100vh">
    <center
      class="wrapper"
      style="
        width: 100%;
        table-layout: fixed;
        background-color: ghostwhite;
        padding-bottom: 60px;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border-spacing: 0;
          max-width: 600px;
          background-color: #fff;
          font-family: sans-serif;
          color: #4a4a4a;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
        "
      >
        <!-- BORDER -->
        <tr>
          <td height="4" style="background-color: #01e2fd; padding: 0"></td>
        </tr>
        <!-- LOGO SECTION -->
        <tr>
          <td style="padding: 14px 0 4px">
            <table width="100%" style="border-spacing: 0">
              <tr>
                <td style="font-size: 0; text-align: left">
                  <table
                    style="
                      border-spacing: 0;
                      width: 50%;
                      display: inline-block;
                      vertical-align: top;
                    "
                  >
                    <tr style="display: flex; ">
                      <td style="padding: 0 0 10px;display: flex; align-items: center;">
                        <a href="https://steppingstonesapp.com" target="_blank">
                          <img
                            src="https://res.cloudinary.com/dus5nxe5w/image/upload/v1653500851/SteppingStonesLogo2_hlpw6d.png"
                            alt="Stepping Stones App logo"
                            width="70"
                            style="border: 0"
                          />
                        </a>
                
                          <td>
                            <h1 style="font-size: 1rem; color: rgb(79, 9, 145); padding: 0px;">Stepping Stones<br>
                                
                                <span style="font-size: 0.6rem; color: skyblue; padding: 0px;">Business Resource Solutions</span>
                            </h1>
                          </td>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td>
            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="border-spacing: 0"
            >
              <tr>
                     <td style="padding: 5px 24px; ">
                        <p>Hello, ${name}</p>
                        <p>We're happy you're here. Let's get your email address verified:</p>
                     </td>
                     </tr>
                     </table>
                     <table width="100%" cellspacing="0" cellpadding="0" >
                    <tr>
                        <td style="padding: 5px 24px;">
                            <table cellspacing="0" cellpadding="0" >
                                <tr >
                                    <td align="center" style="border-radius: 5px; background-color: #1f457f;">
                                        <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight: bold; text-decoration: none;border-radius: 5px; padding: 12px 18px; border: 1px solid #1F7F4C; display: inline-block;">Click to verify email &rarr;</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
            </table>
          </td>
        </tr>

        <tr>
          <!-- Footer -->
          <td
            style="
              background-color: #fff;
              color: #000;
              padding: 5px 10px;
              text-align: center;
            "
          >
            <table width="100%" style="border-spacing: 0">
              <tr>
                <td style="background-color: #01e2fd"></td>
              </tr>
              <tr>
                <td
                  style="
                    padding: 45px 20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <a
                    href="https://steppingstonesapp.com"
                    style="text-decoration: none; margin: 10px 0px"
                  >
                    <img
                      src="https://res.cloudinary.com/dus5nxe5w/image/upload/v1653500262/android-chrome-512x512_cpqzhe.png"
                      alt="Stepping Stones App logo"
                      width="100"
                      style="border: 0"
                    />
                  </a>

                  <a
                    href="https://steppingstonesapp.com/#about"
                    style="text-decoration: none; color: #000; margin: 10px 0px"
                  >
                    About
                  </a>

                  <a
                    href="https://steppingstonesapp.com/#features"
                    style="text-decoration: none; color: #000; margin: 10px 0px"
                    >Features</a
                  >

                  <a
                    href="https://steppingstonesapp.com/#faqs"
                    style="text-decoration: none; color: #000; margin: 10px 0px"
                  >
                    FAQs
                  </a>
                </td>
              </tr>
              <!-- End Border -->
              <tr>
                <td style="background-color: #01e2fd"></td>
              </tr>
              <tr style="height: 6rem">
                <td>
                  <p style="font-size: 0.8rem">
                    Stepping Stones App<sup>&copy;</sup> is the copyright and
                    product of <span>More Media International</span> ${year}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- BORDER -->
        <tr>
          <td height="4" style="background-color: #01e2fd; padding: 0"></td>
        </tr>
      </table>
      <!-- End Main Class -->
    </center>
    <!-- End Wrapper -->
  </body>
</html>`;
};

export const verifyEmailConfirmationTemplate = (name: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="margin: 0; height: 100vh">
    <center
      class="wrapper"
      style="
        width: 100%;
        table-layout: fixed;
        background-color: ghostwhite;
        padding-bottom: 60px;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border-spacing: 0;
          max-width: 600px;
          background-color: #fff;
          font-family: sans-serif;
          color: #4a4a4a;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
        "
      >
        <!-- BORDER -->
        <tr>
          <td height="4" style="background-color: #01e2fd; padding: 0"></td>
        </tr>
        <!-- LOGO SECTION -->
        <tr>
          <td style="padding: 14px 0 4px">
            <table width="100%" style="border-spacing: 0">
              <tr>
                <td style="font-size: 0; text-align: left">
                  <table
                    style="
                      border-spacing: 0;
                      width: 50%;
                      display: inline-block;
                      vertical-align: top;
                    "
                  >
                    <tr style="display: flex; ">
                      <td style="padding: 0 0 10px;display: flex; align-items: center;">
                        <a href="https://steppingstonesapp.com" target="_blank">
                          <img
                            src="https://res.cloudinary.com/dus5nxe5w/image/upload/v1653500851/SteppingStonesLogo2_hlpw6d.png"
                            alt="Stepping Stones App logo"
                            width="70"
                            style="border: 0"
                          />
                        </a>
                
                          <td>
                            <h1 style="font-size: 1rem; color: rgb(79, 9, 145); padding: 0px;">Stepping Stones<br>
                                
                                <span style="font-size: 0.6rem; color: skyblue; padding: 0px;">Business Resource Solutions</span>
                            </h1>
                          </td>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td>
            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="border-spacing: 0"
            >
              <tr>
                     <td style="padding: 5px 24px; ">
                        <p>Hello, ${name}</p>
                        <p>Thank you for verifying your email address</p>
                     </td>
                     </tr>
            </table>
          </td>
        </tr>

        <tr>
          <!-- Footer -->
          <td
            style="
              background-color: #fff;
              color: #000;
              padding: 5px 10px;
              text-align: center;
            "
          >
            <table width="100%" style="border-spacing: 0">
              <tr>
                <td style="background-color: #01e2fd"></td>
              </tr>
              <tr>
                <td
                  style="
                    padding: 45px 20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <a
                    href="https://steppingstonesapp.com"
                    style="text-decoration: none; margin: 10px 0px"
                  >
                    <img
                      src="https://res.cloudinary.com/dus5nxe5w/image/upload/v1653500262/android-chrome-512x512_cpqzhe.png"
                      alt="Stepping Stones App logo"
                      width="100"
                      style="border: 0"
                    />
                  </a>

                  <a
                    href="https://steppingstonesapp.com/#about"
                    style="text-decoration: none; color: #000; margin: 10px 0px"
                  >
                    About
                  </a>

                  <a
                    href="https://steppingstonesapp.com/#features"
                    style="text-decoration: none; color: #000; margin: 10px 0px"
                    >Features</a
                  >

                  <a
                    href="https://steppingstonesapp.com/#faqs"
                    style="text-decoration: none; color: #000; margin: 10px 0px"
                  >
                    FAQs
                  </a>
                </td>
              </tr>
              <!-- End Border -->
              <tr>
                <td style="background-color: #01e2fd"></td>
              </tr>
              <tr style="height: 6rem">
                <td>
                  <p style="font-size: 0.8rem">
                    Stepping Stones App<sup>&copy;</sup> is the copyright and
                    product of <span>More Media International</span> ${year}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- BORDER -->
        <tr>
          <td height="4" style="background-color: #01e2fd; padding: 0"></td>
        </tr>
      </table>
      <!-- End Main Class -->
    </center>
    <!-- End Wrapper -->
  </body>
</html>`;
};
