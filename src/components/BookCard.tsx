import React, { useState } from "react";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { downloadBook } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadBook(book.download);
      toast({
        title: "Download Started",
        description: "Your book is being downloaded",
      });
    } catch (error) {
      console.error("Download error:", error);
      
      if (error instanceof Error && error.message.includes("IP has been temporarily blocked")) {
        toast({
          title: "IP Address Blocked",
          description: "Your IP address has been temporarily blocked by the server. Please try again later or use a different connection.",
          variant: "destructive",
          duration: 3000,  // Show this message longer
        });
      } 

      else if (error instanceof Error && error.message.includes("Wrong hash")) {
        toast({
          title: "Download Failed",
          description: "Wrong hash detected. The download link might be invalid or expired.",
          variant: "destructive",
        });
      }
      else {



      toast({
        title: "Download Failed",
        description: "There was an error downloading the book. Please try again.",
        variant: "destructive",
      });
     }
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pt-[140%] bg-slate-200">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x300?text=No+Cover";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
            <p className="text-slate-500 text-sm text-center p-4">No cover available</p>
          </div>
        )}
      </div>
      <CardContent className="flex-grow flex flex-col p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-slate-600 text-sm mb-2 italic line-clamp-1">
          {book.author}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {book.year && (
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              {book.year}
            </span>
          )}
          {book.extension && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {book.extension.toUpperCase()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
