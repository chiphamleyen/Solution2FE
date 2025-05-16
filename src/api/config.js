const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_PATHS_ADMIN = {
  LOGIN: `${BASE_URL}/account/admin_login`,
};

const API_PATHS_USER = {
  LOGIN: `${BASE_URL}/account/user_login`,
  REGISTER: `${BASE_URL}/account/signup`,
};

const API_PATHS = {
  REGISTER: `${BASE_URL}/account/signup`,
}

export { BASE_URL, API_PATHS, API_PATHS_ADMIN, API_PATHS_USER };
