
// Download projects/images as zip by date
export const downloadProjectsByDate = async ({ from, to }) => {
  const response = await axiosInstance.get(`/projects/download/by-date`, {
    params: { from, to },
    responseType: 'blob',
  });
  return response;
};
import axiosInstance from "../utils/axiosInstance";
import axiosMultipartInstance from "../utils/axiosMultipart";

// Download Excel report for projects by date range
export const downloadProjectsExcelByDate = async ({ from, to }) => {
  const response = await axiosInstance.get(`/projects/download/excel-by-date`, {
    params: { from, to },
    responseType: 'blob',
  });
  return response;
};

export const createProject = async (data) => {
  const response = await axiosMultipartInstance.post("/projects", data); // Server sets cookie
  return response.data;
};

export const getProjects = async ({ page = 1, limit = 4, search = "", from = "", to = "" } = {}) => {
  const response = await axiosInstance.get("/projects", {
    params: {
      page,
      limit,
      search,
      from,
      to,
    },
    withCredentials: true, // Optional: if your server uses cookies for auth
  });
  return response.data; // should return { data: [...], total: number }
};


export const getProjectById = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`); // Server sets cookie
  return response.data;
};

export const updateProjectData = async (projectId, data) => {
  const response = await axiosInstance.put(`/projects/${projectId}/prediction`,data); // Server sets cookie
  return response.data;
};

