import createError from "http-errors";
import { LoadTimes, Prisma, PrismaClient, SourceDirectoryType } from "@prisma/client";
import { DataProps } from "../../types";
import moment from "moment";

const prisma = new PrismaClient();

const getAnalytics = async () => {
  // get online users by day
  const onlineUsers = await prisma.onlineUser.findMany({});
  // use prisma to get online users by day
  // for example: to get start of the day using moment - moment().startOf('day')
  // to get end of the day using moment - moment().endOf('day')
  const onlineUsersToday = onlineUsers.filter((user) => moment(user.createdAt).isBetween(moment().startOf('day'), moment().endOf('day')));
  // get online users yesterday
  // for example: to get start of yesterday using moment - moment().subtract(1, 'days').startOf('day')
  // to get end of yesterday using moment - moment().subtract(1, 'days').endOf('day')
    const onlineUsersYesterday = onlineUsers.filter((user) => moment(user.createdAt).isBetween(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')));
  // calculate the percentage difference between yesterday and today
  // online users today - online users yesterday / online users yesterday * 100
    const onlineUsersPercentageDifference = (onlineUsersToday.length - onlineUsersYesterday.length) / onlineUsersYesterday.length * 100;
  // get average app times by day
    const loadTimes = await prisma.loadTimes.findMany({});
    const averageLoadTimesByDay = loadTimes.reduce((acc, loadTime) => {
        const date = moment(loadTime.date).format('DD-MM-YYYY');
        if (acc[date as keyof LoadTimes]) {
            acc[date] = acc[date] || [];
            acc[date].concat(loadTime);
        }
        return acc;
    }, {} as Record<string, LoadTimes[]>)

    const averageLoadTimesByDayArray = Object.keys(averageLoadTimesByDay).map((key) => {
        const average = +averageLoadTimesByDay[key].reduce((acc: number, loadTime) => acc + loadTime.loadTime, 0) / averageLoadTimesByDay[key].length;
        return { date: key, average };
    })

    return { onlineUsersToday, onlineUsersPercentageDifference, averageLoadTimesByDayArray };
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


const viewed = (event: string, data: any) => {

};


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
