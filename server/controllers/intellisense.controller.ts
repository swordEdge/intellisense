import axios from "axios";
import { Request, Response } from "express";
import { MESSAGES } from "../constants";
import "dotenv/config";

type AggregateData = Record<string, number[]> & { time: string[] };
type ApiData = Record<string, AggregateData>;

function isValidPeriod(period: number) {
  const validPeriods = [10, 30, 60];
  return validPeriods.includes(period);
}

function averageData(period: number, data: AggregateData): AggregateData {
  const { time, ...rest } = data;
  const result = Object.entries(rest).reduce((acc, [key, seriesData]) => {
    let aggregatedData: number[] = [];
    let sum = 0;
    seriesData.forEach((item, index) => {
      if (index === 0 || index % period !== 0) {
        sum = sum + item;
      } else {
        aggregatedData.push(sum / period);
        sum = item;
      }
    });
    return {
      ...acc,
      [key]: aggregatedData,
    };
  }, {});
  let aggregatedTimeSeries: string[] = [];
  for (let index = 0; index < time.length / period; index++) {
    console.log(
      "ddddd",
      Math.floor(
        Date.parse(time[index * period]) +
          Date.parse(time[(index + 1) * period - 1]) / 2
      )
    );
    const averageTime = new Date(
      Math.floor(
        Date.parse(time[index * period]) +
          Date.parse(time[(index + 1) * period - 1]) / 2
      )
    ).toISOString();
    aggregatedTimeSeries.push(averageTime);
  }
  return Object.assign(result, { time: aggregatedTimeSeries }) as AggregateData;
}

function aggregateData(period: number, data: ApiData): ApiData {
  return Object.entries(data).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: averageData(period, value),
    };
  }, {});
}

export const aggregate = async (req: Request, res: Response) => {
  try {
    const { period } = req.body;
    const endPoint =
      process.env.ENDPOINT ||
      "https://reference.intellisense.io/test.dataprovider";
    if (isValidPeriod(period)) {
      const timeSeriesData = await axios.get(endPoint);
      const result = aggregateData(period, timeSeriesData.data);
      return res.status(200).json(result);
    } else {
      console.log(MESSAGES.INVALID_PERIOD_DATA);
      return res.status(400);
    }
  } catch (error) {
    console.log(error);
    console.log(MESSAGES.UNKNOWN_ERROR);
  }
};
