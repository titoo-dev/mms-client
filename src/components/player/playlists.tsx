import { memo, useRef } from "react";
import { Separator } from "../ui/separator";
import { usePlayerStore } from "@/stores";
import { useApiClient } from "@/hooks";
import { TrackCover } from "@/pages/Tracks/components/track-cover.tsx";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { WaveBars } from "./wave-bars";

export function Playlists() {
  const { playlistOrder, shuffleOrder, isShuffle } = usePlayerStore();
  const { getCurrentIndex } = usePlayerStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  const playingIndex = getCurrentIndex();

  return (
    <>
      <Separator className="bg-foreground/[8%] w-full" />
      <Virtuoso
        ref={virtuoso}
        data={isShuffle ? shuffleOrder : playlistOrder}
        style={{ height: 256 }}
        initialTopMostItemIndex={playingIndex}
        className={"overflow-x-hidden will-change-transform"}
        totalCount={playlistOrder.length}
        itemContent={(index, data) => {
          return <PlayListElement index={index} trackId={data} />;
        }}
      />
    </>
  );
}

const PlayListElement = memo(
  ({ trackId }: { trackId: string; index: number }) => {
    const { useTracks } = useApiClient();
    const { data } = useTracks({ id: trackId });
    const { currentTrackId } = usePlayerStore();

    const isCurrent = currentTrackId === trackId;

    if (!data || data.length === 0) return <div className="h-[64px]"></div>;

    const track = data[0];

    return (
      <li className="hover:bg-foreground/[5%] mt-2 flex cursor-pointer items-center justify-between px-4 py-2">
        <div className="flex items-end gap-3">
          <TrackCover
            className="w-[48px] rounded-xl"
            trackId={track.id}
            trackTitle={track.title}
          />

          <div className="flex flex-col">
            <small className="font-bold">{track.title}</small>
            <small>
              {track.artists.map((artist) => artist.name).join(", ")}
            </small>
          </div>
        </div>

        {isCurrent && <WaveBars />}
      </li>
    );
  },
);
