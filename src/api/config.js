const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_PATHS_ADMIN = {
  LOGIN: `${BASE_URL}/account/admin_login`,
  REPORT: `${BASE_URL}/report/admin_report`,
};

const API_PATHS_USER = {
  LOGIN: `${BASE_URL}/account/user_login`,
  REGISTER: `${BASE_URL}/account/signup`,
  REPORT: `${BASE_URL}/report/user_report?min_date=2025-05-16&max_date=2025-05-18`,
};

const API_PATHS = {
  REGISTER: `${BASE_URL}/account/signup`,
  FILE_UPLOAD: `${BASE_URL}/prediction/file_upload`,
}

export { BASE_URL, API_PATHS, API_PATHS_ADMIN, API_PATHS_USER };
