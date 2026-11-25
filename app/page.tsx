"use client";

import { WordsPreloader } from "@/ui/words-preloader";
import { CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full flex flex-col items-center justify-center bg-[#121212] text-white selection:bg-white/20 overflow-hidden">
      {/* Words preloader component (Skiper8 recreation) */}
      <WordsPreloader className="font-syne" />

      {/* Landing page background matching preview */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 pb-[26vh] sm:pb-[22vh]">
        <h1
          aria-label="AAKARTVA"
          className="font-syne text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-none font-extrabold text-white flex items-center justify-center select-none tracking-[0.06em] sm:tracking-[0.12em]"
        >
          <span className="inline-block rotate-180">V</span>
          <span className="inline-block rotate-180">V</span>
          <span className="inline-block">K</span>
          {/* Pulled closer to K to remove the optical gap */}
          <span className="inline-block rotate-180 -ml-[0.12em]">V</span>
          <span className="inline-block">R</span>
          <span className="inline-block">T</span>
          <span className="inline-block">V</span>
          {/* Pulled closer to V to close the double-diverging diagonal void */}
          <span className="inline-block rotate-180 -ml-[0.18em]">V</span>
        </h1>
      </main>

      <CrowdCanvas
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png"
        rows={15}
        cols={7}
        crowdSize={5}
        scale={0.7}
        className="h-[42vh] sm:h-[48vh] md:h-[52vh]"
      />
    </div>
  );
}
