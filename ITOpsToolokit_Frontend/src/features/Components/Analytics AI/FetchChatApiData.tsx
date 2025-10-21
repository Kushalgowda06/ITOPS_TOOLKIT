import { Api } from "../../Utilities/api";

async function fetchChatApiData(url,body) {
let postbody = {
    "question": body
  }
try {
    const response = await Api.postData(url,postbody);
    return response;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}
export default fetchChatApiData;

