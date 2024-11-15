"use client";
import { useState } from "react";
import classNames from 'classnames';
import Image from "next/image";

const MessageComponent = ({ content, isSent }: any) => {
    const messageClasses = classNames({
        isSent: "text-green-300"
    });

    return <div className="text-slate-300">{ content } { `${isSent}` }</div>
}

export const Presentation = () => {

    const [messages, setMessages] = useState([]);

    return (
        <section className="w-full h-screen
        flex items-center justify-center
        bg-white">
            
            <div className="w-[600px] h-[700px] px-8 py-4
            flex flex-col items-center justify-between
            rounded-[45px] border-2 border-dashed border-black
            shadow-xl
            bg-red-300">
                <div className="flex flex-col gap-4">
                    <MessageComponent content="Something should be green" isSent={ true } />
                    <MessageComponent content="Something should be red" isSent={ false } />
                </div>

                <div className="w-full h-[40px]
                flex
                rounded-2xl
                bg-white">
                    <input className="w-full h-4/5 bg-red" />
                    <Image
                    width={ 16 }
                    height={ 16 }
                    src={"/icons/send.png"}
                    alt="Send icon"
                    ></Image>
                </div>
            </div>

        </section>
    );
}
