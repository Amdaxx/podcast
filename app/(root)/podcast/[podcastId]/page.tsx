"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpiner from '@/components/LoaderSpiner'
import PodcastDetailsPlayer from '@/components/PodcastDetailsPlayer'
import PodcastCard from '@/components/ui/PodcastCard'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'>}}) => {
  const { user } = useUser();
  const podcast = useQuery(api.podcast.getPodcastById, { podcastId })
  const isOwner = user?.id === podcast?.authorId;
  const similarPodcasts = useQuery(api.podcast.getPodcastByVoiceType, { podcastId })
  if(!similarPodcasts || !podcast) return <LoaderSpiner />
  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">
          Currently Playing
        </h1>
        <figure className="flex gap-3">
          <Image  
            src="/icons/headphone.svg"
            alt="headphone"
            width={24}
            height={24}
          />
          <h2 className="text-10 font-bold text-white-1">
            {podcast?.views}
          </h2>
        </figure>
      </header>
      <PodcastDetailsPlayer
        isOwner={isOwner}
        podcastId = {podcast._id}
        {...podcast}
      />

      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{podcast?.podcastDescription}</p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">{podcast?.voicePrompt}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">{podcast?.imagePrompt}</p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
            <div>
              {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl}) => (
              <PodcastCard
                 key={_id}
                 imgUrl={imageUrl}
                 title={podcastTitle}
                 description={podcastDescription}
                 podcastId={_id}
               />
        ))}
            </div>
        ) : (
          <>
          <EmptyState 
            title = "No similar podcast found"
            buttonLink = "/discover"
            buttonText = "Discover more podcasts"
          />
          </>
        )}
      </section>
    </section>
  )
}

export default PodcastDetails