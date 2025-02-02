"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useState } from 'react'
import MeetingSetup from '@/components/MeetingSetup'
import MeetingRoom from '@/components/MeetingRoom'
import { useGetCallById } from '@/hooks/useGetCallById'
import Loader from '@/components/Loader'
import { use } from 'react'

const Meeting = ({params}: {params: Promise<{id: string}>}) => {

  const id = use(params).id;
  const { isLoaded } = useUser()
  const [isSetUpCompleted, setIsSetUpCompleted] = useState(false);
  const {call, isCallLoading} = useGetCallById(id)

  if (!isLoaded || isCallLoading) return <Loader />

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetUpCompleted ? (
            <MeetingSetup setIsSetUpCompleted={setIsSetUpCompleted}/>
          ) :(
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting