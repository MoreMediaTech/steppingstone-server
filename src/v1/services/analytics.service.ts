import { LoadTimes, Role } from "@prisma/client";
import moment from "moment";
import prisma from "../../client";

const getAnalytics = async () => {
  // get total number of registered users
  const totalNumberUsers = await prisma.user.findMany({
    where: {
      role: Role.USER,
    },
  });
  // get total number of users where email is verified
  const totalNumberUsersEmailVerified = await prisma.user.findMany({
    where: {
      role: Role.USER,
      emailVerified: true,
    },
  });
  // get online users by day
  const onlineUsers = await prisma.onlineUser.findMany({});

  // use prisma to get online users by day
  // for example: to get start of the day using moment - moment().startOf('day')
  // to get end of the day using moment - moment().endOf('day')
  const onlineUsersToday = onlineUsers.filter((user) =>
    moment(user.createdAt).isBetween(
      moment().startOf("day"),
      moment().endOf("day")
    )
  );

  // get online users yesterday
  // for example: to get start of yesterday using moment - moment().subtract(1, 'days').startOf('day')
  // to get end of yesterday using moment - moment().subtract(1, 'days').endOf('day')
  const onlineUsersYesterday = onlineUsers.filter((user) =>
    moment(user.createdAt).isBetween(
      moment().subtract(1, "days").startOf("day"),
      moment().subtract(1, "days").endOf("day")
    )
  );
  
  // calculate the percentage difference between yesterday and today
  // online users today - online users yesterday / online users yesterday * 100
  const onlineUsersPercentageDifference =
    ((onlineUsersToday.length - onlineUsersYesterday.length) /
      onlineUsersYesterday.length) *
    100;
  // get average app times by day
  const loadTimes = await prisma.loadTimes.findMany({});

  // loadTimes.reduce to return an object with the date as the key and the load times as the value
  // for example: { '2021-01-01': [{ loadTime: 1000, date: '2021-01-01' }, { loadTime: 2000, date: '2021-01-01' }], '2021-01-02': [{ loadTime: 3000, date: '2021-01-02' }] }
  const loadTimesByDay = loadTimes.reduce((acc: any, loadTime: LoadTimes) => {
    if (!acc[loadTime.date]) {
      acc[loadTime.date] = [];
    }
    acc[loadTime.date].push(loadTime);
    return acc;
  }, {});

  // Object.keys(loadTimesByDay).map to return an array of objects with the date and the average load time
  // for example: [{ date: '2021-01-01', averageLoadTime: 1500 }, { date: '2021-01-02', averageLoadTime: 3000 }]
  const averageLoadTimesByDay = Object.keys(loadTimesByDay).map((date) => {
    const averageLoadTime =
      loadTimesByDay[date].reduce(
        (acc: number, loadTime: LoadTimes) =>
          acc +
          Math.floor(
            moment.duration(loadTime.loadTime, "milliseconds").asSeconds()
          ),
        0
      ) / loadTimesByDay[date].length;
    return { date, avgLoadTime: Math.floor(averageLoadTime) };
  });

  // Returned viewed screens
  const viewedScreens = loadTimes.reduce((acc: any, loadTime: LoadTimes) => {
    if (!acc[loadTime.name]) {
      acc[loadTime.name] = [];
    }
    acc[loadTime.name].push(loadTime);
    return acc;
  }, {});

  // Return an  array of objects with id, name, date and times viewed
  // for example: [{ id: 1, name: 'Home', date: '2021-01-01', timesViewed: 1500 }, { id: 2, name: 'Profile', date: '2021-01-01', timesViewed: 3000 }]
  const viewedScreensByDay = Object.keys(viewedScreens).map((name) => {
    const timesViewed = viewedScreens[name].length;
    const date = viewedScreens[name][0].date;
    const id = viewedScreens[name][0].id;
    return { id, name, date, timesViewed };
  });

  // Return top 5 most viewed screens
  const topFiveViewedScreens = loadTimes.reduce(
    (acc: any, loadTime: LoadTimes) => {
      if (!acc[loadTime.name]) {
        acc[loadTime.name] = [];
      }
      acc[loadTime.name].push(loadTime);
      return acc;
    },
    {}
  );

  // Object.keys(topFiveViewedScreens).map to return an array of objects with the name and the number of times viewed
  // for example: [{ name: 'Home', timesViewed: 1500 }, { name: 'Profile', timesViewed: 3000 }]
  const topFiveViewedScreensByDay = Object.keys(topFiveViewedScreens)
    .map((name) => {
      const timesViewed = topFiveViewedScreens[name].length;
      return { name, timesViewed };
    })
    .slice(0, 5);

  return {
    onlineUsers: onlineUsers.length,
    onlineUsersToday: onlineUsersToday.length,
    onlineUsersPercentageDifference,
    averageLoadTimesByDay,
    totalNumberUsers: totalNumberUsers.length,
    totalNumberUsersEmailVerified: totalNumberUsersEmailVerified.length,
    viewedScreensByDay,
    topFiveViewedScreensByDay,
  };
};

const addOnlineUser = async (userId: string, data: any) => {
  const onlineUsers = await prisma.onlineUser.findMany({});

  // check if user is already online
  const today = moment(new Date());
  const userAlreadyOnline = onlineUsers.find(
    (user) =>
      user.userId === userId &&
      moment(user.createdAt).startOf("day").isSame(today.startOf("day"))
  );

  if (userAlreadyOnline) {
    return { success: false, message: "User is already online" };
  }

  // Add user to online users list
  await prisma.onlineUser.create({
    data: {
      userId: userId,
      type: data.type,
    },
  });

  return { success: true };
};

const viewed = (event: string, data: any) => {};

const recordLoadTimes = async (userId: string, data: any) => {
  await prisma.loadTimes.create({
    data: {
      userId: userId,
      type: data.type,
      loadTime: data.loadTime,
      date: data.date,
      name: data.name,
    },
  });

  return { success: true };
};

export const analyticsService = {
  addOnlineUser,
  viewed,
  recordLoadTimes,
  getAnalytics,
};
