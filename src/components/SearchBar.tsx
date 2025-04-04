
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mb-12"
    >
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search for books (e.g., 48 Laws of Power)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-4 pr-10 py-6 text-lg w-full border-2 border-slate-200 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 h-auto"
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
