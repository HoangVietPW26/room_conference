import { 
    CallControls, 
    CallingState, 
    CallParticipantsList, 
    CallStatsButton, 
    PaginatedGridLayout, 
    SpeakerLayout, 
    useCallStateHooks 
} from '@stream-io/video-react-sdk';
import React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
import { useRouter } from 'next/navigation';

type CallLayoutType = 'speaker-left' | 'speaker-right' | 'grid' | 'gallery'
const MeetingRoom = () => {

    const searchParams = useSearchParams()
    const [layout, setLayout] = useState('speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const isPersonalRoom = !!searchParams.get('personal')
    const { useCallCallingState } = useCallStateHooks()
    const callingState = useCallCallingState()
    const router = useRouter()
    if (callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left"/>
            default:
                return <SpeakerLayout participantsBarPosition="right"/>
        }
    }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
        <div className='relative flex size-full items-center justify-center'>
            <div className='flex size-full max-w-[1000px] items-center'>
                <CallLayout />
            </div>
            <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {'show-block': showParticipants})}>
                <CallParticipantsList onClose={()=> setShowParticipants(false)}/>
            </div>
        </div>

        <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap' >
            <CallControls onLeave={()=>router.push("/")}/>
            
            <DropdownMenu>
                <div className='flex items-center'>
                <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4x535b]'>
                    <LayoutList size={20} className='text-white' />
                </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className='border-dark-1 text-white bg-dark-1'>
                    {['Grid','Speaker-left', 'Speaker-right'].map((item, index) => (
                        <div key={index}>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}>
                                {item}
                            </DropdownMenuItem>
                        </div>
                    ))}
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>

            <CallStatsButton />
            <button onClick={()=> setShowParticipants((prev) => !prev)} className='rounded-2xl cursor-pointer bg-[#19232d] px-4 py-2 hover:bg-[#4x535b]'>
                <User size={20} className='text-white' />
            </button>
            {!isPersonalRoom && <EndCallButton />}
        </div>
    </section>
  )
}

export default MeetingRoom