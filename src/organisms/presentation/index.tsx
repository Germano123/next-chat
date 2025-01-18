"use client";
import { useEffect, useState } from "react";
import classNames from 'classnames';
import Image from "next/image";
import { PuffLoader } from "react-spinners";
import { ChatConnect } from "@/services/chat-connection";
import { Container } from "@/atoms/container";
import Link from "next/link";

enum ENotificationType {
    MESSAGE= "New Message",
    EVENT= "New Event",
    COURSE= "New Course",
}

interface IEventNotification {
    eventType: string;
    content: string;
}

const EventNotification = ({ eventType, content }: IEventNotification) => {
    // TODO: change button color
    const notifMarkCN = classNames(
        {
            "bg-red-300": eventType === "New Message",
            "bg-green-300": eventType === "New Course",
            "bg-[#8a0303]": eventType === "New Event",
        }
    );

    return (
        <div className="w-full h-fit
        flex items-center gap-2
        px-4 py-1">
            <div className={ `w-4 h-4
            border-[1px] border-black
            rounded-full
            bg-red-300 ${ notifMarkCN }` }></div>
            { content }
        </div>
    );
}

interface IMessage {
    content: string;
    isSent: boolean;
}

const MessageComponent = ({ content, isSent }: any) => {
    const messageClasses = classNames(
        "max-w-[85%] w-fit px-4 py-2",
        "rounded-2xl",
        "shadow-lg",
        "bg-white",
        "z-10",
        {
            "bg-yellow-200 self-end": isSent,
        }
    );

    return <div className={ messageClasses }>{ content }</div>
}

interface IUser {
    username: string;
    msgs: IMessage[];
    lastView: string;
    status: "Online" | "Offline";
}

const ConnectedUser = ({ username, msgs, lastView, status }: IUser) => {
    const statusClassname = classNames(
        {
            "bg-green-500": status === "Online",
            "bg-red-500": status === "Offline",
        }
    );

    return (
        <div className="w-full flex justify-between items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-300"></div>
            <div className="grow justify-self-start">
                <p>{ username }</p>
                <p>{ msgs[0]?.content }</p>
            </div>
            <div className="flex flex-col gap-1 items-center">
                <div className={ `w-3 h-3 rounded-full ${ statusClassname }` }></div>
                <div className="text-slate-400 text-[11px]">{ lastView }</div>
            </div>
        </div>
    );
}

const mockMessages: IMessage[] = [
    { content: "Olá, me chamo Germano", isSent: true },
    { content: "Este app é apenas um teste de interações de chat", isSent: true },
    { content: "Pode me auxiliar testando ele um pouco?", isSent: true },
    { content: "Claro. Como posso fazer isso?", isSent: false },
];

const mockNotifications: IEventNotification[] = [
    { content: "Pedro mandou mensagem", eventType: ENotificationType.MESSAGE },
    { content: "Novo evento marcado", eventType: ENotificationType.EVENT },
    { content: "Novo curso lançado", eventType: ENotificationType.COURSE },
];

const mockUsers: IUser[] = [
    {
        username: "Germano Gomes",
        msgs: [],
        lastView: "23:58",
        status: "Online"
    },
    {
        username: "João de Souza",
        msgs: [],
        lastView: "10:12",
        status: "Offline"
    },
    {
        username: "Maria Clara",
        msgs: [],
        lastView: "16:48",
        status: "Offline"
    },
];

export const Presentation = () => {

    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messages, setMessages] = useState<IMessage[]>(mockMessages);
    const [notifications, setNotifications] = useState<IEventNotification[]>(mockNotifications);
    const [connectedUsers, setConnectedUsers] = useState<IUser[]>(mockUsers);

    useEffect(() => {
        ChatConnect().then((connection) => {
            connection.onopen = () => {
                console.log('WebSocket Client Connected');
                setLoading(false);
                console.log("Loading messages...");
                // setMessages(mockMessages);
            }
            
            connection.onmessage = (event) => {
                console.log("Recieving event of type: ", event.data?.type);

                switch(event.data.type) {
                    case "sendmessage":
                        console.log("Handling message");
                        const isSent = false;
                        setMessages([...messages, { content: event.data.content, isSent }]);
                        break;
                    case "notification":
                        console.log("Handling notification");
                        break;
                    default:
                        break;
                }

            }
        });
    }, []);

    const sendMessage = () => {
        if (msg) {
            console.log("Sending message to server");
            setMessages([...messages, { content: msg, isSent: true }]);
            setMsg(null);
        }
    }

    return (
        <section className="w-full h-screen
        flex items-center justify-center
        bg-white">
            
            <div className="relative w-[550px] h-[500px] px-8 py-4
            flex flex-col items-center justify-between
            border-2 border-dashed border-black
            rounded-[45px]
            shadow-xl">
                {/* TODO: rotate 45 deg */}
                <div className="w-full h-full
                    absolute
                    top-0 right-0
                    opacity-45
                    rounded-[inherit]
                    bg-center
                    bg-[length:50px_50px]
                    bg-[url('/background.svg')]"></div>

                <div className="w-full h-4/5 flex flex-col gap-4">
                    <div className="w-full h-12 px-4
                    flex items-center
                    z-10
                    shadow-lg
                    rounded-[23px]
                    border-[1px] border-black
                    bg-white">User info</div>

                    <div className="w-full h-full p-2
                    flex flex-col gap-4 justify-start
                    z-10
                    overflow-x-auto overflow-scroll
                    scroll-smooth
                    ">
                        {
                            (loading) ?
                            <PuffLoader
                            cssOverride={{ zIndex: 10, placeSelf: "center" }}
                            color="#ddc62e"/> :
                            messages.map((msg, index) => {
                                return <MessageComponent
                                key={ `message-${ index }` }
                                content={ msg.content }
                                isSent={ msg.isSent }
                            /> 
                            })
                        }
                    </div>
                </div>

                <div className="w-full h-[50px] px-4 py-2
                flex items-center gap-4
                border-[1px] border-black
                shadow-lg
                rounded-2xl
                bg-white">
                    <input className="w-full h-4/5 px-2
                    z-10
                    focus:outline-none
                    bg-transparent"
                    onChange={(e) => setMsg(e.target.value)} />
                    
                    <Image
                        className="z-20"
                        width={ 24 }
                        height={ 24 }
                        src={"/icons/send.png"}
                        alt="Send icon"
                        onClick={ () => sendMessage() }
                    />
                </div>

                <div
                className="w-80 h-full
                absolute right-0 top-0 z-30
                flex flex-col items-center justify-around gap-4
                translate-x-[110%]">
                    <Container
                    width="w-full"
                    height="h-full"
                    classes="flex flex-col items-center justify-center">
                        <Link href="https://www.abacatepay.com/" target="_blank">
                            <Image
                            width={ 180 }
                            height={ 180 }
                            className=""
                            src="/logo/logo-abacatepay.png"
                            alt="AbacatePay Logo" />
                        </Link>
                    </Container>
                
                    <Container
                    width="w-full"
                    height="h-full"
                    classes="p-6
                    flex flex-col gap-2 justify-start">
                            <p><b>Eventos</b></p>
                            { notifications.map((notif) => {
                                return <EventNotification
                                    content={ notif.content }
                                    eventType={ notif.eventType }
                                />
                            })}
                    </Container>
                </div>


                <Container
                    width="w-80"
                    height="h-full"
                    classes="pt-4 px-6
                    absolute left-0 top-0 z-30
                    flex flex-col gap-2 items-start justify-start
                    -translate-x-[110%]">
                        <p><b>Usuários Online</b></p>

                        { connectedUsers.map((user, index) => {
                            return <ConnectedUser
                                key={`user-${ index }`}
                                username={ user.username }
                                msgs={ user.msgs }
                                lastView={ user.lastView }
                                status={ user.status }
                            />
                        })}
                </Container>
            </div>

        </section>
    );
}
