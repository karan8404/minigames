"use client"

import { useEffect, useState } from "react";
import { socket } from "@/components/socket";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");;

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", (message) => {
      console.log("Received message:", message); // Add this line
      setMessage(message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  return (
    <div className="container flex flex-col">
      <div className="flex flex-col gap-5">
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>
      <Card className="mt-10 w-auto mx-auto">
        <CardHeader>
          <CardTitle className=' flex flex-col gap-3 text-center'>
            <p>Messages</p>
            <p className="text-gray-500">{socket.id}</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex bg-slate-400 m-5 py-4 rounded-md justify-center items-center h-full">
          <div className="">{
            (message == "") ?
              <p className="text-gray-300">No Message to display</p> :
              <p className="text-gray-900">{message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-row gap-3">
          <Input placeholder="Type your message here" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          <Button variant={"default"}
            onClick={() => {
              socket.emit("message", inputValue)
              setMessage(inputValue)
              setInputValue("")
            }}>Send
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}