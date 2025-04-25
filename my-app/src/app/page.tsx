import Image from "next/image";
import { SelectRoad } from "@/components/selectroad";
export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-3">
        <Image
          className="dark:invert"
          src="/images/icon.png"
          alt="RTP logo"
          width={320}
          height={320}
          priority
        />
        <SelectRoad />
      </div>
    </div>
  );
}
