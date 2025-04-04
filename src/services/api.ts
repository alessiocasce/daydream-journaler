
import { Book } from "@/types/book";

export const searchBooks = async (bookName: string): Promise<Book[]> => {
  try {
    const response = await fetch("http://localhost:3000/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ bookName }),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
export const downloadBook = async (downloadPath: string): Promise<void> => {
  try {
    const response = await fetch("http://localhost:3000/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ downloadPath }),
      mode: "cors",
    });

    if (!response.ok) {
      if (response.status === 403 || response.status===400) {
        const errorData = await response.json();
        if (errorData.error === 'IP_BLOCKED') {
          throw new Error('Your IP has been temporarily blocked. Please try again later or use a different connection.');
        }

        if (errorData.error === 'WRONG_HASH') {
          throw new Error('Wrong hash');
        }

      }
      throw new Error(`Error: ${response.status}`);
    }

    // Get the filename from the Content-Disposition header if available
    const contentDisposition = response.headers.get("Content-Disposition");
    console.log(contentDisposition)
    let filename = "book";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download API Error:", error);
    throw error;
  }
};
