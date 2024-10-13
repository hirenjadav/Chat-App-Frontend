import axios from "axios";

const host: string = 'http://localhost:3000';

function constructFullUrl(endpoint: string): string {
  return host + endpoint;
}

function get(
  url: string,
  params: any = null
): Promise<any> {
  return new Promise<any>(resolve => {
    const headers: any = {};
    if(localStorage.getItem('token')) {
      const accessToken: string = localStorage.getItem('token')!;
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if(localStorage.getItem('userData')) {
      const userData: any = JSON.parse(localStorage.getItem('userData')!);
      params = {
        ...params,
        userId: userData.id
      }
    }

    axios
      .get(constructFullUrl(url), { params, headers })
      .then(response => {
        resolve(response?.data ? response.data : response);
      })
      .catch(error => {
        resolve(error);
      })
  });
}

function post(
  url: string,
  args: any = null,
  params: any = null
): Promise<any> {
  return new Promise<any>(resolve => {
    const headers: any = {};
    if(localStorage.getItem('token')) {
      const accessToken: string = localStorage.getItem('token')!;
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if(localStorage.getItem('userData')) {
      const userData: any = JSON.parse(localStorage.getItem('userData')!);
      params = {
        ...params,
        userId: userData.id
      }
    }

    axios
      .post(
        constructFullUrl(url),
        args,
        { params, headers }
      )
      .then(response => {
        resolve(response?.data ? response.data : response);
      })
      .catch(error => {
        resolve(error);
      })
  });
}

const httpServices = {
  get,
  post,
}

export default httpServices;