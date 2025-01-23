"use client"
import Image from 'next/image'
import React from 'react'
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingPopUp from './MeetingPopUp'

const MeetingTypeList = () => {

    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const router = useRouter()

    const createMeeting = () => {}

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img="/icons/add-meeting.svg" 
            title="New meeting" 
            description="Start an instant meeting"  
            handleClick={() => setMeetingState('isInstantMeeting')}
            className='bg-orange-1'
        />
        <HomeCard 
            img="/icons/schedule.svg" 
            title="Schedule Meeting" 
            description="Plan your meeting"  
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className='bg-blue-1'
        />
        <HomeCard 
            img="/icons/recordings.svg" 
            title="View Recordings" 
            description="Checkout your recordings"  
            handleClick={()=> router.push('/recordings')}
            className='bg-purple-1'
        />
        <HomeCard 
            img="/icons/join-meeting.svg" 
            title="Join meeting" 
            description="Via invitation link"  
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className='bg-yellow-1'
        />

        <MeetingPopUp 
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Start an instant meeting"
            buttonText="Start Meeting"
            handleClick={createMeeting}
            className='text-center'
        />
    </section>
  )
}

export default MeetingTypeList