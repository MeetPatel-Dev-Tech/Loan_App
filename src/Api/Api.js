import Constant from '../CommonFiles/Constant';
import {customHeaders, headerURLEncoded} from '../Utils/CommonUtils';

var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

// let headerURLEncoded = {
//     Accept: '*/*',
//     'Content-Type': 'multipart/form-data',
// };

const PostApi = async (url, data, put) => {
  console.log('data', data);
  console.log('put', put);
  const requestOptions = {
    method: put == false ? 'POST' : 'PUT',
    headers: customHeaders,
    body: JSON.stringify(data),
    redirect: 'follow',
  };
  console.log('url', url);
  console.log('requestOptions', requestOptions);
  return fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log('post - result', result);
      let data = JSON.parse(result);
      return data;
    })
    .catch(error => {
      console.log('error', error);
      return error;
    });
};
const PostApiImage = async (url, data) => {
  const requestOptions = {
    method: 'POST',
    headers: headerURLEncoded,
    body: data,
    redirect: 'follow',
  };
  console.log('requestOptions', requestOptions, JSON.stringify(data));
  console.log('url', url);
  return fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log('post - result', result);
      let data = JSON.parse(result);
      return data;
    })
    .catch(error => {
      console.log('error', error);
      return error;
    });
};
const PostApiImageWithToken = async (url, data, Tocken) => {
  var myHeaders = new Headers();
  myHeaders.append('authorization', Tocken);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'follow',
  };
  console.log('requestOptions', requestOptions, JSON.stringify(data));
  console.log('url', url);
  return fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log('post - result', result);
      let data = JSON.parse(result);
      return data;
    })
    .catch(error => {
      console.log('error', error);
      return error;
    });
};

const PutAPI = async (url, data, isFormData) => {
  console.log('URL: ', url);
  console.log('Data: ', data);
  let formBody = [];
  if (isFormData == false) {
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
  }
  const requestOptions = {
    method: 'PUT',
    headers:
      isFormData == true ? Constant.headerFormData : Constant.headerURLEncoded,
    body: isFormData == true ? data : formBody,
  };
  return fetch(url, requestOptions)
    .then(async response => response.json())
    .then(data => {
      console.log('PATCH API RESPONSE: ', data);
      return data;
    })
    .catch(error => {
      console.error('There was an error!', error);
      return error.message;
    });
};

const GetApi = async url => {
  const requestOptions = {
    method: 'GET',
    headers: customHeaders,
    redirect: 'follow',
  };
  console.log('get api url..', url);

  return await fetch(url, requestOptions)
    .then(async response => response.json())
    .then(async data => {
      // console.log('GET API RESPONSE', data.data[0]);
      return data;
    })
    .catch(error => {
      console.error('there was an error!', error);
      return error.message;
    });
};

const postApiWithTocken = async (url, data, isFormData, Tocken) => {
  console.log('URL: ', url);
  console.log('Data: ', data);

  var myHeaders = new Headers();
  myHeaders.append('authorization', Tocken);

  let formBody = [];
  if (isFormData == true) {
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
  }
  console.log('formBody: ', formBody);

  const requestOptions = {
    method: 'POST',
    headers:
      isFormData == false
        ? {
            ...Constant.headerFormData,
            // 'Content-Type': 'application/json',
            Authorization: Tocken,
          }
        : myHeaders,
    body: isFormData == false ? JSON.stringify(data) : formBody,
  };
  console.log('requestOptions', requestOptions);
  return fetch(url, requestOptions)
    .then(async response => response.json())
    .then(data => {
      console.log('POST API RESPONSE: ', data);
      return data;
    })
    .catch(error => {
      console.error('There was an error!', error);
      return error.message;
    });
};

const deleteApi = async url => {
  const requestOptions = {
    method: 'DELETE',
    headers: customHeaders,
  };
  return (
    fetch(url, requestOptions)
      .then(async response => {
        // response.json();
        console.log('DELETE API RESPONSE: ', response);
        return response.json();
      })
      // .then(async response => response.json())
      // .then(data => {
      //   console.log('DELETE API RESPONSE: ', data);
      //   return data;
      // })
      .catch(error => {
        console.error('There was an error!', error);
        return error.message;
      })
  );
};

export {
  PostApi,
  GetApi,
  PostApiImage,
  deleteApi,
  postApiWithTocken,
  PutAPI,
  PostApiImageWithToken,
};
