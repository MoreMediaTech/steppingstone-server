import { allowedOrigins } from "./allowedOrigins";

export const corsOptions = {
  // origin: (origin: any, callback: any) => {
  //     if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
  //         callback(null, true);
  //     } else {
  //         callback(new Error('Not allowed by CORS'));
  //     }
  // },
  origin: "https://steppingstonesapp.com",
  optionsSuccessStatus: 200,
  credentials: true,
};