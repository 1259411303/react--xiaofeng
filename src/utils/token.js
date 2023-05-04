// const TOKEN_KEY = 'geek_pc'

// const getToken = () => localStorage.getItem(TOKEN_KEY)
// const setToken = token => localStorage.setItem(TOKEN_KEY, token)
// const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// export { getToken, setToken, clearToken }


// 封装ls存token
const key = 'pc-key'

const setToken = (token) => {
  return window.localStorage.setItem(key, token)
}

const getToken = () => {
  return window.localStorage.getItem(key)
}

const removeToken = () => {
  return window.localStorage.removeItem(key)
}

export { getToken, setToken, removeToken }