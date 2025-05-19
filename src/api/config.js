const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_PATHS_ADMIN = {
  LOGIN: `${BASE_URL}/account/admin_login`,
  REPORT: `${BASE_URL}/report/admin_report`,
  USER_MANAGEMENT_LIST: `${BASE_URL}/user_management/list_users`,
  USER_MANAGEMENT_GET_USER: `${BASE_URL}/user_management`,
  USER_MANAGEMENT_UPDATE_USER: `${BASE_URL}/user_management`,
  USER_MANAGEMENT_CREATE_ADMIN: `${BASE_URL}/user_management/create_new_admin`,
  USER_MANAGEMENT_DELETE_USER: `${BASE_URL}/user_management`,
  USER_MANAGEMENT_FEEDBACK_LIST: `${BASE_URL}/feedback/list_feedbacks`,
};

const API_PATHS_USER = {
  LOGIN: `${BASE_URL}/account/user_login`,
  REGISTER: `${BASE_URL}/account/signup`,
  REPORT: `${BASE_URL}/report/user_report`,
  MY_FEEDBACK_LIST: `${BASE_URL}/feedback/list_feedback_by_self`,
  CREATE_FEEDBACK: `${BASE_URL}/feedback/create_feedback`,
};

const API_PATHS = {
  REGISTER: `${BASE_URL}/account/signup`,
  FILE_UPLOAD: `${BASE_URL}/prediction/file_upload`,
  PROFILE: `${BASE_URL}/account/profile`,
  UPDATE_PROFILE: `${BASE_URL}/account/update_profile`,
}

export { BASE_URL, API_PATHS, API_PATHS_ADMIN, API_PATHS_USER };
