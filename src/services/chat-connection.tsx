
const url = "wss://ef8mc2gnx2.execute-api.eu-central-1.amazonaws.com/production/";

export const ChatConnect = async () => {
    const socket = new WebSocket(url);

    return socket;
}
