import axios from "axios";

const host: string = 'http://fafafda.fdsfa/';

function constructFullUrl(endpoint: string): string {
  return host + endpoint;
}

function get(
  url: string,
  params: any = null
): Promise<any> {
  return new Promise<any>(resolve => {
    axios
      .get(constructFullUrl(url), { params })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        setTimeout(() => {
          resolve(error);
        }, 5000);
      })
  });
}

function post(
  url: string,
  args: any = null,
  params: any = null
): Promise<any> {
  return new Promise<any>(resolve => {
    axios
      .post(
        constructFullUrl(url),
        args,
        { params }
      )
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        setTimeout(() => {
          resolve(error);
        }, 5000);
      })
  });
}

const httpServices = {
  get,
  post,
}

export default httpServices;