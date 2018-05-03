import axios from "axios"

export const HTTP = axios.create({
  baseURL: "http://127.0.0.1:5000/api/"
})

export const setAuthorizationToken = (token: string) => {
  HTTP.defaults.headers.Authorization = "Bearer " + token
}

export const removeAuthorizationToken = () => {
  delete HTTP.defaults.headers.Authorization
}