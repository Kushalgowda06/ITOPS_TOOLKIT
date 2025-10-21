import { Api } from "../../Utilities/api";

async function fetchApiData(url) {
try {
    const response = await Api.getCall(url);
    return response;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}
export default fetchApiData;