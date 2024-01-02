import ApiService from "../services/apiService";

export function loginApi({ email, password }) {
  return new Promise((resolve, reject) => {
    ApiService.post("/login", {
      email,
      password,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function registerApi(credentials) {
  
//   ApiService.setHeader("content-type", "multipart/form-data");
//   const {first_name , last_name , email , password , password_confirmation , company_name , company_phone_number , company_logo , company_create , company_code} = credentials
//   const formData = new FormData();
//   formData.append('first_name' , first_name)
//   formData.append('last_name' , last_name)
//   formData.append('email' ,email)
//   formData.append('password' , password)
//   formData.append('password_confirmation' , password_confirmation)
//   if (company_create == 1) {
//     formData.append('company_name', company_name);
//     formData.append('company_phone_number', company_phone_number);
//   }
//   formData.append('company_logo', company_logo)
//   formData.append('company_create' ,company_create)
//   formData.append('company_code' ,company_code)
// console.log(company_logo)

  return new Promise((resolve, reject) => {
    ApiService.post(`/register`, credentials , null,  true )
      .then((response) => {
        // console.print('file: auth.module.js | register| response', response);
        resolve(response);
      })
      .catch((e) => {
        // console.print('Console Log: : error', e);
        reject(e);
      });
  });
}
// export function registerApi(credentials) {
//   ApiService.setHeader("content-type", "multipart/form-data");
//   const formData = new FormData();

//   const fieldsToInclude = [
//     "first_name",
//     "last_name",
//     "email",
//     "password",
//     "password_confirmation",
//     "company_name",
//     "company_phone_number",
//     "company_logo",
//     "company_create",
//     "company_code",
//   ];

//   // Loop through the fields and append them to the form data
//   fieldsToInclude.forEach((fieldName) => {
//     if (credentials[fieldName] !== undefined) {
//       formData.append(fieldName, credentials[fieldName]);
//     }
//   });

//   return new Promise((resolve, reject) => {
//     ApiService.post(`/register`, formData)
//       .then((response) => {
//         resolve(response);
//       })
//       .catch((e) => {
//         reject(e);
//       });
//   });
// }


export function logoutApi() {
  return new Promise((resolve, reject) => {
    ApiService.post("/logout")
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function verifyEmailApi(email) {
  return new Promise((resolve, reject) => {
    ApiService.post("verify-email", {
      email,
      // formData,
    })
      .then((response) => {
        console.print(
          "file: auth.module.js | verifyEmailApi| response",
          response
        );
        resolve(response.data);
      })
      .catch((e) => {
        // console.print("Console Log: : error", e);
        reject(e);
      });
  });
}

export function verifyOtpApi({ otp }) {
  return new Promise((resolve, reject) => {
    ApiService.post("verify-otp", {
      otp_code: otp,
    })
      .then((response) => {
        console.print(
          "file: auth.module.js | verifyOtpApi| response",
          response
        );
        resolve(response.data);
      })
      .catch((e) => {
        console.print("Console Log: : error", e);
        reject(e);
      });
  });
}

export function forgetPasswordApi(email) {
  return new Promise((resolve, reject) => {
    ApiService.post("/forgot-password", {
      ...email,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function resetPasswordApi(credentials) {
  // console.log('credentials' , credentials)
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

 const updatedCredentials = {
    ...credentials,
    email,
    token
  };
  return new Promise((resolve, reject) => {
    ApiService.post("reset-password" , updatedCredentials)
      .then((response) => {
        // console.print(
        //   'file: auth.module.js | resetPasswordApi| response',
        //   response
        // );
        resolve(response);
      })
      .catch((e) => {
        // console.print("Console Log: : error", e);
        reject(e);
      });
  });
}



export function updateProfileApi(formData) {
  ApiService.setHeader("content-type", "multipart/form-data");
  return new Promise((resolve, reject) => {
    ApiService.post("update-profile", formData)
      .then((response) => {
        console.print(
          "file: auth.module.js | updateProfileApi| response",
          response
        );
        resolve(response.data);
      })
      .catch((e) => {
        console.print("Console Log: : error", e);
        reject(e);
      });
    ApiService.setHeader("content-type", "application/json");
  });
}

export function deleteProfilePicApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post("delete-profile-picture", data)
      .then((response) => {
        console.print(
          "file: auth.module.js | deleteProfilePicApi| response",
          response
        );
        resolve(response.data);
      })
      .catch((e) => {
        console.print("Console Log: : error", e);
        reject(e);
      });
  });
}

export function updatePasswordApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post("change-password", data)
      .then((response) => {
        console.print(
          "file: auth.module.js | updateProfileApi| response",
          response
        );
        resolve(response.data);
      })
      .catch((e) => {
        console.print("Console Log: : error", e);
        reject(e);
      });
  });
}
