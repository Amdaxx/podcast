"use client";

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Carousel from '../Carousel';
import Header from '../Header';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpiner from '../LoaderSpiner';
import { cn } from '@/lib/utils';
import { useAudio } from '@/providers/AudioProvider';

const RightSideBar = () => {
  const router = useRouter();
  const { user } = useUser();
  const topPodcaster = useQuery(api.users.getTopUserByPodcastCount);
  
  const { audio } =  useAudio();
 
  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px]',{
      'h-[calc(100vh-140px)]': audio?.audioUrl 
      })}>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex  pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between"></div>
          <h1 className="text-16  font-semibold text-white-1">{user?.firstName} {user?.lastName}</h1>
          <Image src="/icons/right-arrow.svg" alt="arrow" width={24} height={24}/>
        </Link>
      </SignedIn>
      <section>
        <Header headerTitle="Fans Like You"/>
        <Carousel fansLikeDetail={topPodcaster!}/>
      </section>
      <section className="flex flex-col gap-8 pt-12">
       <Header headerTitle="Top Podcaster"/>
       <div className="flex flex-col gap-6">
        {topPodcaster?.slice(0, 4).map((podcaster) => (
          <div key={podcaster._id} className="cursor-pointer justify-between" onClick={
            () => router.push(`/profile/${podcaster.clerkId}`)
          }>
            <figure className="flex items-center gap-2">
              <Image 
                src={podcaster.imageUrl}
                alt={podcaster.name}
                width={44}
                height={44}
                className="aspect-square rounded-lg"
              />
              <h2 className="text-14 font-semibold text-white-1">{podcaster.name}</h2>
              <div className="flex items-center">
              <p className="text-12 font-normal px-10 text-white-1">{podcaster.totalPodcasts} podcasts</p>
            </div>
            </figure>
          </div>
        ))}
       </div>
      </section>
    </section>
  )
}

export default RightSideBar