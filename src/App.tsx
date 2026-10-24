
import {  useEffect, useState } from "react";
import type { GalleryImage } from "./types.ts";
import  type { ChangeEvent } from "react";
import { ImageOff } from "lucide-react";

import GalleryHeader from "./components/GalleryHeader.tsx";
import GalleryToolbar from "./components/GalleryToolbar.tsx";
import "./App.css";


function App() {

  const [ images, setImages ] = useState<GalleryImage[]>([]);
  const [ apiImages, setApiImages ] =  useState<GalleryImage[]>([]);
  const [ serchTerm , setSearchTerm ] = useState("");
  const [ isLoading , setIsLoading ] = useState(false);
  const [ error , setError ] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [sourceFilter, setSourceFilter] = useState<"all" | "api" | "local">("all");

  const fetchApiImages = async () => {
      setIsLoading(true);
      setError("");
      try{
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=electronics&per_page=10`,
          {
            headers: {
              Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        if(!response.ok){
            throw new Error("Failed to fetch images from API.");
      }
      const data = await response.json();

      const imageDetails: Record<
        string,
        { name: string; description: string }
      > = {
        "0": {
          name: "Workspace Inspiration",
          description: "A peaceful space to focus and get things done.",
        },
        "1": {
          name: "Creative Workday",
          description: "A productive moment working on a laptop.",
        },
        "2": {
          name: "Coffee & Creativity",
          description: "A cozy desk setup for fresh ideas and inspiration.",
        },
        "3": {
          name: "Digital Lifestyle",
          description: "Staying connected with technology throughout the day.",
        },
        "4": {
          name: "Focused Moments",
          description: "A workspace designed for concentration and productivity.",
        },
        "5": {
          name: "Daily Inspiration",
          description: "Simple moments that make a workday special.",
        },
        "6": {
          name: "Modern Workspace",
          description: "Technology and comfort come together in one place.",
        },
        "7": {
          name: "Work & Relaxation",
          description: "A comfortable setting for work and short breaks.",
        },
        "8": {
          name: "Personal Collection",
          description: "A memorable scene saved in your photo gallery.",
        },
        "9": {
          name: "Everyday Moments",
          description: "Capturing little details from daily life.",
        },
      };

      setApiImages(
        data.results.map((item: any) => {
          const details = imageDetails[item.id] ?? {

            name: `Photo Collection ${item.id}`,
            description: "A beautiful moment to keep in your personal collection.",
          };

          return {
            id: item.id,
            url: item.urls.regular,
            name: details.name,
            description: details.description,
            source: "api",
          };
        }),
      );

      }catch(error){
          console.error("Error fetching images: ",error);
          setError("Failed to load images. Please try again.");

      }finally{
          setIsLoading(false);
      }
      
  };

  useEffect(() => {
      fetchApiImages();
  },[]);

  // const addTestImage = () => {
  //     setImages([ ...images , {
  //       id : crypto.randomUUID(),
  //       url : "https://picsum.photos/300",
  //       name : "Test Image",
  //       source: "api",
  //     },
  //   ]);
  // }

  const allImages = [...images, ...apiImages];

  const searchImages = allImages.filter((image) => { 
    const matchesSearch = image.name.toLowerCase().includes(serchTerm.toLowerCase());
    const matchesSource = sourceFilter === "all" || image.source === sourceFilter;

    return matchesSearch && matchesSource;
});

  const deleteAllImage = () => {
     const resultAllDelete = confirm("Are you sure you want to delete all images?");

     if(!resultAllDelete){
          return;
      }
      images.forEach((image) => {
          if(image && image.source === "local"){
              URL.revokeObjectURL(image.url);
          }
      });
      setImages([]);
      setApiImages([]);
  }

  const deleteImage = (id : string) => {
      const localImage = images.find((image) => image.id === id);

      if(localImage?.source === "local"){
          URL.revokeObjectURL(localImage.url);
          setImages((prev) => prev.filter((image) => image.id !== id));
      }else{
          setApiImages((prev) => prev.filter((image) => image.id !== id));
      }
      
  }

const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const MAX_IMAGES = 20;
      const MAX_SIZE = 5 * 1024 * 1024;

      if (images.length >= MAX_IMAGES) {
        alert("Gallery is full! Maximum 20 images allowed.");
        event.target.value = "";
        return;
      }

      const selectedFiles = Array.from(files);

      const invalidFiles = selectedFiles.filter(
        (file) => !file.type.startsWith("image/")
      );

      if (invalidFiles.length > 0) {
        alert("Please select image files only!");
        event.target.value = "";
        return;
      }

      const seenNames = new Set(images.map((image) => image.name));
      let duplicateCount = 0;

      const uniqueFiles = selectedFiles.filter((file) => {
        if (seenNames.has(file.name)) {
          duplicateCount += 1;
          return false;
        }

        seenNames.add(file.name);
        return true;
      });

      const oversizedFiles = uniqueFiles.filter(
        (file) => file.size > MAX_SIZE
      );

      const validSizeFiles = uniqueFiles.filter(
        (file) => file.size <= MAX_SIZE
      );

      const remainingSlots = MAX_IMAGES - allImages.length;
      const imageToAdd = validSizeFiles.slice(0, remainingSlots);

      const addedCount = imageToAdd.length;
      const oversizedCount = oversizedFiles.length;
      const rejectedCount = Math.max(
        0,
        validSizeFiles.length - addedCount
      );

      if (imageToAdd.length > 0) {
        const newImages: GalleryImage[] = imageToAdd.map((file) => ({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file),
          name: file.name,
          description: "A photo from your personal collection.",
          source: "local",
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);
      }

      const summary = [
        `Upload completed: ${addedCount} image(s) added.`,
        duplicateCount > 0
          ? `${duplicateCount} duplicate image(s) skipped.`
          : "",
        oversizedCount > 0
          ? `${oversizedCount} image(s) skipped because they exceed 5 MB.`
          : "",
        rejectedCount > 0
          ? `${rejectedCount} image(s) skipped because the gallery limit is 20.`
          : "",
      ].filter(Boolean).join("\n");

      alert(summary);
      event.target.value = "";
};


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-800 sm:px-6 lg:px-8">
        
        <GalleryHeader imageCount={allImages.length}/>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-600 border-t-cyan-400"></div>
            <p className="animate-pulse text-cyan-400 font-medium">
              Loading images...
            </p>
          </div>
        )}

        {error && !isLoading && images.length === 0 && (
          <div className="fixed left-1/2 top-28 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg 
          border border-red-300 bg-red-50 p-4 text-center text-red-700 shadow-lg ">
            <p>{error}</p>
            <button
              onClick={fetchApiImages}
              className="mt-3 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}


        <GalleryToolbar
          searchTerm={serchTerm}
          onSearchChange={setSearchTerm}
          onImageUpload={handleImageUpload}
          imageCount={allImages.length}
          onDeleteAll={deleteAllImage}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
        />

        <br />
        <div>
            {allImages.length === 0 ?
              (
                
                <div className="mx-auto my-10 flex max-w-xl flex-col items-center rounded-2xl border-2 border-dashed border-green-200 bg-white px-6 py-12 text-center shadow-sm sm:my-14 sm:px-10">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <ImageOff size={38} strokeWidth={1.5} />
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    No images yet
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
                    Your gallery is waiting for its first photo. Upload images to start building your collection.
                  </p>

                  <p className="mt-5 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                    Supported format: JPG, PNG, WEBP
                  </p>
                </div>

              ) 
              : 
              (
                <>
                
                  {searchImages.length === 0 ? 
                      (
                        <div className="border border-green-500 rounded-md max-w-[400px] m-auto col-span-full flex flex-col items-center justify-center py-10 text-center">
                          <ImageOff size={40} className="mb-3 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-700">
                            No images found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Try another search term or change the image filter.
                          </p>
                        </div>

                      )
                      :
                      (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {searchImages.map((image) =>  
                                 
                            <div
                              key={image.id}
                              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition
                               duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                onClick={() => setSelectedImage(image)}
                                className="h-44 w-full cursor-pointer object-cover"
                                // className="h-52 w-full cursor-pointer object-cover sm:h-40 lg:h-36"
                              />

                              <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-base font-semibold text-gray-900">
                                      {image.name}
                                    </h3>
                                    
                                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                                      {image.description}
                                    </p>

                                  </div>

                                  <button
                                    onClick={() => deleteImage(image.id)}
                                    className="shrink-0 rounded-lg cursor-pointer bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            )}
                        </div>
                      )
                  }
                  
                </>
              )
            }
        </div> 

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl 
              bg-white p-4 pt-16 shadow-2xl sm:p-6 sm:pt-16"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-2xl text-white 
                transition hover:bg-red-700 cursor-pointer sm:right-4 sm:top-4"
                aria-label="Close image preview"
              >
                ×
              </button>

              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />

              <div className="px-2 pb-2 pt-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedImage.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        )}       
    </div>
  );
}

export default App;
