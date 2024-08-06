"use client"
import EmptyState from '@/components/EmptyState'
import LoaderSpiner from '@/components/LoaderSpiner'
import SearchBar from '@/components/SearchBar'
import PodcastCard from '@/components/ui/PodcastCard'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: {search} }: 
  { searchParams : {search: string }}) => {
  const podcastData = useQuery(api.podcast.getPodcastBySearch, { search: search || ''})
  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
     <div className="flex flex-col gap-9">
      <h1 className="text-20 text-bold text-white-1">
        {!search ? 'Discover Trending Podcasts' :
        'Search results for: '}
        {search && <span className="text-white-2">{search}</span>}
      </h1>
      {podcastData ? (
        <>
          {podcastData.length > 0 ? (
            <div className="podcast_grid">
              {podcastData?.map(({ _id, podcastTitle, podcastDescription, imageUrl}) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                 />
              ))}
            </div>
          ) : (
            <EmptyState title="No results found"/>
          )}
        </>
      ) : (
        <LoaderSpiner />
      )}
     </div>
    </div>
  )
}

export default Discover