import config from "./config";
const { SERVER_API } = config;

const client = {
    serverApi: SERVER_API,
    setUrl: function (url) {
        this.serverApi = url;
    },
    send: async function (url, method = "GET", body = null) {
        url = `${this.serverApi}${url}`;
        const headers = {
            "Content-Type": "application/json",
        };
        const options = {
            method,
            headers,
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        const data = await response.json();
        return { response, data };
    },
    get: function (url) {
        return this.send(url);
    },

    post: function (url, body) {
        return this.send(url, "POST", body);
    },

    put: function (url, body) {
        return this.send(url, "PUT", body);
    },

    patch: function (url, body) {
        return this.send(url, "PATCH", body);
    },

    delete: function (url) {
        return this.send(url, "DELETE");
    },
};
export default client;