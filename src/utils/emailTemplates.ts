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
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

  <head data-id="__react-email-head">
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671618/SS_Color_logo_with-background2_b2zdqb.webp" />
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Verify your email<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
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
            <h1 data-id="react-email-heading" style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Verify your email</h1>
            <p data-id="react-email-text" style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848">Hello ${name}, We&#x27;re happy you&#x27;re here. Let&#x27;s get your email address verified:</p>
            <table align="center" width="100%" data-id="react-email-section" style="padding:27px 0 27px" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><a href="${url}" data-id="react-email-button" target="_blank" style="background-color:#293531;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;line-height:100%;max-width:100%;padding:11px 23px"><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%;mso-text-raise:16.5" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:8.25px">Click to verify email →</span><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                </tr>
              </tbody>
            </table>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
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
                                  <td data-id="__react-email-column"><a href="https://twitter.com" data-id="react-email-link" target="_blank" style="color:#067df7;text-decoration:none"><img data-id="react-email-img" alt="Twitter" src="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" width="24" height="24" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:62px" /></a></td>
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
                    <p data-id="react-email-text" style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">Stepping Stones App<sup>©</sup> is the copyright and product of <a href="https://www.buildwithequilibrium.com" data-id="react-email-link" target="_blank" style="color:#8898aa;text-decoration:none">Equilibrium Startup Lab LLC</a> 2023<br />All rights reserved.</p>
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

export const verifyEmailConfirmationTemplate = (name: string) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

  <head data-id="__react-email-head">
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671618/SS_Color_logo_with-background2_b2zdqb.webp" />
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Email verified for Stepping Stones.<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
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
            <h1 data-id="react-email-heading" style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Email verified for Stepping Stones.</h1>
            <p data-id="react-email-text" style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848">Hello ${name},</p>
            <p data-id="react-email-text" style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848">Thank you for verifying your email address</p>
            <table align="center" width="100%" data-id="react-email-section" style="padding:27px 0 27px" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><a href="https://steppingstonesapp.com/auth/login" data-id="react-email-button" target="_blank" style="background-color:#293531;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;line-height:100%;max-width:100%;padding:11px 23px"><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%;mso-text-raise:16.5" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:8.25px">Click to login →</span><span><!--[if mso]><i style="letter-spacing: 23px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                </tr>
              </tbody>
            </table>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
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
                                  <td data-id="__react-email-column"><a href="https://twitter.com" data-id="react-email-link" target="_blank" style="color:#067df7;text-decoration:none"><img data-id="react-email-img" alt="Twitter" src="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" width="24" height="24" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:62px" /></a></td>
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
                    <p data-id="react-email-text" style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">Stepping Stones App<sup>©</sup> is the copyright and product of <a href="https://www.buildwithequilibrium.com" data-id="react-email-link" target="_blank" style="color:#8898aa;text-decoration:none">Equilibrium Startup Lab LLC</a> 2023<br />All rights reserved.</p>
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

export const welcomeEmailTemplate = (name: string) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

  <head data-id="__react-email-head">
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671618/SS_Color_logo_with-background2_b2zdqb.webp" />
    <link rel="preload" as="image" href="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">The business support app to help you take the right step on your business journey.<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body data-id="__react-email-body" style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" data-id="__react-email-container" role="presentation" cellSpacing="0" cellPadding="0" border="0" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
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
            <p data-id="react-email-text" style="font-size:16px;line-height:26px;margin:16px 0">Hi ${name},</p>
            <p data-id="react-email-text" style="font-size:16px;line-height:26px;margin:16px 0">Welcome to Stepping Stones, the business support app to help you take the right step on your business journey.</p>
            <p data-id="react-email-text" style="font-size:16px;line-height:26px;margin:16px 0">Click the button below to access the app.</p>
            <table align="center" width="100%" data-id="react-email-section" style="text-align:center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><a href="https://steppingstonesapp.com" data-id="react-email-button" target="_blank" style="background-color:#293531;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-decoration:none;text-align:center;display:inline-block;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Get started</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                </tr>
              </tbody>
            </table>
            <p data-id="react-email-text" style="font-size:16px;line-height:26px;margin:16px 0">Best Regards,<br /><br />Customer Care Team<br />Stepping Stones</p>
            <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
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
                                  <td data-id="__react-email-column"><a href="https://twitter.com" data-id="react-email-link" target="_blank" style="color:#067df7;text-decoration:none"><img data-id="react-email-img" alt="Twitter" src="https://res.cloudinary.com/dhdcepksp/image/upload/e_sharpen:100/v1695671970/logo-black_ajf4q7.webp" width="24" height="24" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:62px" /></a></td>
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
                    <p data-id="react-email-text" style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">Stepping Stones App<sup>©</sup> is the copyright and product of <a href="https://www.buildwithequilibrium.com" data-id="react-email-link" target="_blank" style="color:#8898aa;text-decoration:none">Equilibrium Startup Lab LLC</a> 2023<br />All rights reserved.</p>
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
}