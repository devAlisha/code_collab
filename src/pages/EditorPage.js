import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { io } from "socket.io-client";
import { initSocket } from "../socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  console.log(roomId);
  const codeRef=useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => {
        handleError(err);
      });
      socketRef.current.on("connect_failed", (err) => {
        handleError(err);
      });
      console.log("Location state:", location.state);
      console.log("Username:", location.state?.username);

      function handleError(err) {
        console.log(err.message);
        toast.error(err.message);
        reactNavigator("/");
      }

      socketRef.current.emit("join-room", {
        roomId,
        username: location.state?.username,
      });
      socketRef.current.on("new-user", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined room ${roomId}`);
          console.log(`${username} joined room ${roomId}`);
        }
        setClients(clients);
        socketRef.current.on("code-sync",{
          code:codeRef.current,
          socketId
              
        });
      });

      socketRef.current.on("user-disconnected", ({ socketId, username }) => {
        toast.error(`${username} left room ${roomId}`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();

        socketRef.current.off("join-room");

        socketRef.current.off("new-user");

        socketRef.current.off("user-disconnected");
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
   async function copyRoomId() {
    try
    {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    }
    catch(err)
    {
      toast.error("Failed to copy room ID to clipboard");
    }
  }
async function leaveRoom() {
  reactNavigator("/");
}
  // const socketRef = useRef(null);

  // useEffect(() => {
  //   socketRef.current = io('http://localhost:8000');

  //   socketRef.current.on('connect', () => {
  //     console.log('Socket connected:', socketRef.current.id);
  //   });

  //   socketRef.current.on('disconnect', () => {
  //     console.log('Socket disconnected');
  //   });

  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.disconnect();
  //     }
  //   };
  // }, []);
  // if(!location.state)

  // {
  //   return <Navigate to="/" />
  // }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-collab.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>

      <div className="editorWrap">
        <Editor socketRef ={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
      </div>
    </div>
  );
}

export default EditorPage;
