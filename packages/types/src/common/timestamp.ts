/**
 * ISO 8601 时间戳类型
 * 全仓统一：时间参数一律 ISO 8601 UTC（YYYY-MM-DDTHH:mm:ss.sssZ）
 * 日期维度用 YYYY-MM-DD，小时维度用 YYYY-MM-DDTHH:00
 */
export type ISODateTime = string;
export type ISODate = string;
export type ISOHour = string;
