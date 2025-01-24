"use client"
import { tokenProvider } from "@/actions/stream.action";
import { useUser } from "@clerk/nextjs";
import {
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
//   const userId = "user-id";
//   const token = "authentication-token";
//   const user: User = { id: userId };
  

  
const StreamVideoProvider = ({children}: {children : React.ReactNode}) => {
    
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const {user, isLoaded} = useUser()
    
    
    useEffect(() => {
        if(!isLoaded || !user) return
        if(!apiKey) throw new Error('Stream API Key is required')
        
        console.log(user?.fullName)
        const client = new StreamVideoClient({
            apiKey,
            user: {
                id: user?.id,
                name: user?.username || user?.fullName || user?.id,
                image: user?.imageUrl
            },
            tokenProvider
        })

        setVideoClient(client)
    },[user, isLoaded])

    return (
      <StreamVideo client={videoClient!}>
        {children}
      </StreamVideo>
    )
};

export default StreamVideoProvider;

