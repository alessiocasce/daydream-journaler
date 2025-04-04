
import React from "react";
import { Loader } from "lucide-react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="h-12 w-12 text-blue-600 animate-spin" />
      <p className="mt-4 text-slate-600 text-lg">Searching for books...</p>
    </div>
  );
};

export default LoadingSpinner;
