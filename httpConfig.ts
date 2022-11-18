import Service from "goodvandro-alganews-sdk/dist/Service";

const { API_BASE_URL } = process.env;

if (API_BASE_URL) Service.setBaseURL(API_BASE_URL);
