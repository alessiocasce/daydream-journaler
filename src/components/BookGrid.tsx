
import React from "react";
import { Book } from "@/types/book";
import BookCard from "./BookCard";
import LoadingSpinner from "./LoadingSpinner";

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({ books, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-slate-700 mb-2">No books found</h3>
        <p className="text-slate-500">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
