import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import { searchBooks } from "@/services/api";
import { Book } from "@/types/book";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a book name to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchBooks(query);
      setBooks(results);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching with different keywords",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            BookVoyager
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover and download your next favorite book from our vast library
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {hasSearched && (
          <BookGrid books={books} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Index;
