import HeroVideoDialog from "./ui/hero-video-dialog";

export function HeroVideoDialogDemo() {
    return (
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden block"
          animationStyle="from-center"
          videoSrc="https://youtu.be/aAyIHAO0qhc"
          thumbnailSrc="/scholardao-og.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc="https://youtu.be/aAyIHAO0qhc"
          thumbnailSrc="/scholardao-og.png"
          thumbnailAlt="Hero Video"
        />
      </div>
    );
  }