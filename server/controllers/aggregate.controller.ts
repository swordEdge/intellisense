import axios from "axios";
import { Request, Response } from "express";
import { MESSAGES } from "../constants";
import "dotenv/config";

type AggregateData = Record<string, number[]> & { time: string[] };
export type ApiData = Record<string, AggregateData>;

const isValidPeriod = (period: number) => {
  const validPeriods = [10, 30, 60];
  return validPeriods.includes(period);
}

const averageData = (period: number, data: AggregateData): AggregateData => {
  const { time, ...entryObj } = data;
  const result = Object.entries(entryObj).reduce((acc, [key, serialData]) => {
    let aggregatedData: number[] = []; // average data
    let sum = serialData[0];
    for (let index = 1; index < serialData.length; index++) {
      if (index % period !== 0) {
        sum = sum + serialData[index];
      } else {
        aggregatedData.push(sum / period);
        sum = serialData[index];
      }
    }
    return {
      ...acc,
      [key]: aggregatedData,
    };
  }, {});
  
  let aggregatedTimeSeries: string[] = []; // average time
  for (let index = 0; index < Math.floor(time.length / period); index++) { 
    const averageTime = new Date((Date.parse(time[index * period]) + Date.parse(time[(index + 1) * period - 1])) / 2).toISOString();
    aggregatedTimeSeries.push(averageTime);
  }
  return Object.assign(result, { time: aggregatedTimeSeries }) as AggregateData;
}

const aggregateData = (period: number, data: ApiData): ApiData => {
  return Object.entries(data).reduce((acc, [key, dataToAverage]) => ({
      ...acc,
      [key]: averageData(period, dataToAverage),
    }), {});
}

export const aggregate = async (req: Request, res: Response) => {
  try {
    const { period } = req.body;
    const endPoint = process.env.ENDPOINT || "https://reference.intellisense.io/test.dataprovider";
    if (isValidPeriod(period)) {
      const apiData = await axios.get(endPoint);
      const result = aggregateData(period, apiData.data);
      return res.status(200).json(result);
    } else {
      console.log(MESSAGES.INVALID_PERIOD_DATA);
      return res.status(400).json({
        message: MESSAGES.INVALID_PERIOD_DATA,
      });
    }
  } catch (error) {
    console.log(error);
    console.log(MESSAGES.UNKNOWN_ERROR);
  }
};
