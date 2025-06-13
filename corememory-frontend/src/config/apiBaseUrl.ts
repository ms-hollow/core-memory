const env = import.meta.env.VITE_NODE_ENV;

const apiBaseUrl =
    env === "production"
        ? import.meta.env.VITE_PROD_API_URL
        : env === "development"
        ? import.meta.env.VITE_DEV_API_URL
        : import.meta.env.VITE_LOCAL_API_URL;

export default apiBaseUrl;
