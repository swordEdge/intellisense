import axios from "axios";
import { Request, Response } from "express";
import { MESSAGES } from "../constants";
import "dotenv/config";
import { Serializable } from "child_process";

type SeiresData = number | object;
type AggregateData = Record<string, SeiresData[]> & { time: string[] };
type ApiData = Record<string, AggregateData>;

function isValidPeriod(period: number) {
  const validPeriods = [10, 30, 60];
  return validPeriods.includes(period);
}

function composeAssetData(period: number, data: AggregateData): AggregateData {
    const { time, ...rest } = data;
    const result = Object.entries(rest).reduce((acc, [key, seriesData]) => {
        let aggregatedData: number[] = [];
        let sum = 0;
        seriesData.forEach((item, index) => {
            if (index === 0 || index % period !== 0) {
                if (typeof item === 'number') {
                    sum = sum + item;
                }
            } else {
                aggregatedData.push(sum / period);
                if (typeof item === 'number') {
                    sum = item;
                } else {
                    sum = 0;
                }
            }
        });
        return {
            ...acc,
            [key]: aggregatedData
        }
    }, {});
    const aggregatedTimeSeries = time.filter((item, index) => index % period === 0);
    return Object.assign(result, {time: aggregatedTimeSeries}) as AggregateData;
}

function aggregate(period: number, data: ApiData): ApiData {
    return Object.entries(data).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [key]: composeAssetData(period, value)
        }
    }, {})
}

export const calculate = async (req: Request, res: Response) => {
  try {
    const { period } = req.body;
    const endPoint =
      process.env.ENDPOINT ||
      "https://reference.intellisense.io/test.dataprovider";
    console.log("period", period);

    if (isValidPeriod(period)) {
      const timeSeriesData = await axios.get(endPoint);
      const result = aggregate(period * 60, timeSeriesData.data);
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
