"use client"
import React from 'react'
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingPopUp from './MeetingPopUp'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'


const MeetingTypeList = () => {

    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const { toast } = useToast()
    const router = useRouter()
    const { user } = useUser();
    const client = useStreamVideoClient()

    const [values, setValues] = useState({
        dateTime:  new Date(),
        description: '',
        link: ''
    });

    const [callDetails, setCallDetails] = useState<Call>();

    const createMeeting = async() => {

        console.log(client)
        console.log("****")
        console.log(user)

        if(!client || !user) {
            return
        }

        try {

            if(!values.dateTime) {
                toast({
                    title: 'Pleasae select a date and time',
                })
                return
            }
            const id = crypto.randomUUID()
            const call = client?.call('default', id)

            if (!call) throw new Error('Call not created')

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
            const description = values.description || 'Instant meeting'
            await call.getOrCreate(
                {
                    data: {
                        starts_at: startsAt,
                        custom: {
                            description: description
                        }
                    }
                }
            )

            setCallDetails(call)

            if (!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({
                title: 'Meeting created',
            })

        } catch (error) {
            console.log(error)
            toast({
                title: 'Fail to create meeting',
            })
        }

    }
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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

        {!callDetails ? (
            <MeetingPopUp 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Create a meeting"
            handleClick={createMeeting}
            >
                <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                    <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                        onChange={(e) => {
                            setValues({...values, description: e.target.value})
                        }}
                    />
                </div>
                <div className='flex w-full flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
                <ReactDatePicker 
                    selected={values.dateTime}
                    onChange={(date) => setValues({...values, dateTime: date!})}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    timeCaption='time'
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className='w-full rouned bg-dark-3 p-2 focus:outline-none'
                />
                </div>
            </MeetingPopUp>
        ): (
            <MeetingPopUp 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Meeting created"
            buttonText="Copy Meeting Link"
            handleClick={() => {
                navigator.clipboard.writeText(`${meetingLink}`)
                toast({
                    title: 'Meeting link copied',
                })
            }}
            image="/icons/checked.svg"
            className='text-center'
        />
        )}

        <MeetingPopUp
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Type the link here"
            className="text-center"
            buttonText="Join Meeting"
            handleClick={() => router.push(values.link)}
        >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        </MeetingPopUp>

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