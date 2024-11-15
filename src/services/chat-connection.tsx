import { WebSocket } from "ws";

const ChatConnect = () => {
    const url = "wss://s24tlwwsy3.execute-api.eu-central-1.amazonaws.com/production/";
    const connection = new WebSocket(url);
    
    connection.onmessage = () => {
        
    }

    return ;
}
