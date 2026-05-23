import VideoCard from './VideoCard';
import type { VideoSummary } from '@/lib/api';

interface VideoGridProps {
  videos: VideoSummary[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
      {videos.map((video) => (
        <VideoCard key={video.code} video={video} />
      ))}
    </div>
  );
}
