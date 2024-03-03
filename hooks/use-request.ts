export default function useRequest() {
  const requestHeader = {
    Accept: "application.json",
    "Content-Type": "application/json",
  }

  function doRequest(url: string, method: string, params?: any) {
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      return fetch(url, {
        method: method,
        headers: requestHeader,
        body: JSON.stringify(params),
      }).then((value: any) => value.json().then((data) => data))
    } else {
      return fetch(url, {
        method: method,
        headers: requestHeader,
      }).then((value: any) => value.json().then((data) => data))
    }
  }

  async function GET_DATA(url: string) {
    return await doRequest(url, "GET")
  }

  async function POST_DATA(url: string, payload: any) {
    return await doRequest(url, "POST", payload)
  }

  async function DELETE_DATA(url: string) {
    return await doRequest(url, "DELETE")
  }
  async function PATCH_DATA(url: string, payload: any) {
    return await doRequest(url, "PATCH", payload)
  }

  async function PUT_DATA(url: string, payload: any) {
    return await doRequest(url, "PUT", payload)
  }

  return {
    GET_DATA,
    POST_DATA,
    DELETE_DATA,
    PATCH_DATA,
    PUT_DATA,
  }
}
