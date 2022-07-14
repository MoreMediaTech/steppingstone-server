const year = new Date().getFullYear()

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
</html>`
}

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
}

export const resetPasswordEmailTemplate = (name: string, url: string) => {
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
                     </td>
                     </tr>
                     </table>
                     <table width="100%" cellspacing="0" cellpadding="0" >
                    <tr>
                        <td style="padding: 5px 24px;">
                            <table cellspacing="0" cellpadding="0" >
                                <tr >
                                    <td align="center" style="border-radius: 5px; background-color: #1f457f;">
                                        <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight: bold; text-decoration: none;border-radius: 5px; padding: 12px 18px; border: 1px solid #1F7F4C; display: inline-block;">Click to reset password &rarr;</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    </table>
                     <table width="100%" cellspacing="0" cellpadding="0" style="border-spacing: 0;">
                     <tr>
                     <td style="padding: 5px 24px 20px; text-align:left;">
                    <p>If you’re having trouble clicking the "Verify Email Address" button, copy
                        and
                        paste
                        the URL below
                        into your web browser:
                    </p>
                    <a href="${url}" style="padding-bottom: 5px;">${url}</a>
               
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
</html>`
}

export const resetPasswordVerificationEmailTemplate = (
  name: string,
) => {
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
                            <p>Password has been successfully reset.</p>
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
</html>`
}
