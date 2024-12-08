import { Loader2 } from "lucide-react";
import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
};

export default Loading;
