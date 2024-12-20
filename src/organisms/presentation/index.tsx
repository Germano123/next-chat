"use client";
import { useEffect, useState } from "react";
import classNames from 'classnames';
import Image from "next/image";
import { PuffLoader } from "react-spinners";
import { ChatConnect } from "@/services/chat-connection";

const MessageComponent = ({ content, isSent }: any) => {
    const messageClasses = classNames(
        "max-w-[85%] w-fit px-4 py-2",
        "rounded-2xl",
        "shadow-lg",
        "bg-white",
        "z-10",
        {
            "bg-yellow-200": isSent,
            "self-end": isSent,
        }
    );

    return <div className={ messageClasses }>{ content }</div>
}

interface IMessage {
    content: string;
    isSent: boolean;
}

const mockMessages: IMessage[] = [
    { content: "Olá, me chamo Germano", isSent: true },
    { content: "Este app é apenas um teste de interações de chat", isSent: true },
    { content: "Pode me auxiliar testando ele um pouco?", isSent: true },
    { content: "Claro. Como posso fazer isso?", isSent: false },
];

export const Presentation = () => {

    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(mockMessages);

    useEffect(() => {
        ChatConnect().then((connection) => {
            connection.onopen = () => {
                console.log('WebSocket Client Connected');
                setLoading(false);
                console.log("Loading messages...");
                // setMessages(mockMessages);
            }
        });
    }, []);

    const sendMessage = () => {
        setMessages([...messages, { content: "New msg", isSent: true }]);
    }

    return (
        <section className="w-full h-screen
        flex items-center justify-center
        bg-white">
            
            <div className="relative w-[550px] h-[500px] px-8 py-4
            flex flex-col items-center justify-between
            border-2 border-dashed border-black
            rounded-[45px]
            shadow-xl
            overflow-hidden
            after:content-['']
            after:absolute
            after:w-[135%] after:h-[800px] after:rotate-[45deg]
            after:opacity-45 after:translate-y-[-15%]
            after:bg-center
            after:bg-repeat
            after:bg-[length:50px_50px]
            after:bg-[url('/background.svg')]">
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
                    bg-transparent" />
                    
                    <Image
                    className="z-20"
                        width={ 24 }
                        height={ 24 }
                        src={"/icons/send.png"}
                        alt="Send icon"
                        onClick={ () => sendMessage() }    
                    />
                </div>
            </div>

        </section>
    );
}
