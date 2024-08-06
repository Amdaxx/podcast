"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import GeneratePodcast from "@/components/GeneratePodcast"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
})

const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx'];

const CreatePodcast = () => {

  const router = useRouter();
  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState("");
  const [audioStorageId, setAaudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [voicePrompt, setVoicePrompt] = useState('');

  const { toast } = useToast();
  const createPodcast = useMutation(api.podcast.createPodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if(!audioUrl || !imageUrl || !voiceType) {
        toast({title: 'Please generate audio and image',})
        setIsSubmitting(false);
        throw new Error('Please generate audio and image')
      }
      await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      })
      toast({ title: 'Podcast Created'});
      setIsSubmitting(false);
      router.push('/');
    } catch (error) {
      console.log(error);
     
    }
    setIsSubmitting(false);
  }

  return (

    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">

        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
          <FormField
            control={form.control}
            name="podcastTitle"
            render={({ field }) => (
             <FormItem className="flex flex-col gap-2.5">
               <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
               <FormControl>
                  <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="JSM Pro Podcast" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
         />

         <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              Select AI Voice
            </Label>
            <Select onValueChange={(value)=> setVoiceType(value)}>
              <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1" />
              </SelectTrigger>
              <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 ring-orange-1">
                {voiceCategories.map((category) => (
                  <SelectItem value={category} key={category} className="capitalize focus:bg-orange-1">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
              {voiceType && (
                <audio 
                  src={`/${voiceType}.mp3`}
                  autoPlay
                  className="hidden"

                />
              )}
            </Select>
         </div>
          
         <FormField
            control={form.control}
            name="podcastDescription"
            render={({ field }) => (
             <FormItem className="flex flex-col gap-2.5">
               <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
               <FormControl>
                  <Textarea className="input-class focus-visible:ring-orange-1" placeholder="Write a short podcast description" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
         />
        </div>
        <div className="flex flex-col pt-10">
            
            <GeneratePodcast 
              setAudioStorageId={setAaudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType!}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              imagePrompt={imagePrompt}
              image={imageUrl}
              setImagePrompt={setImagePrompt}
            />

            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold
               text-white-1 transition-all duration-500 hover:bg-black-1">
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin  ml-2"/>
                  </>
                ): (
                  'Submit & Publish Podcast'
                )}
              </Button>
            </div>
        </div>
      </form>
    </Form>
    </section>
  )
}

export default CreatePodcast