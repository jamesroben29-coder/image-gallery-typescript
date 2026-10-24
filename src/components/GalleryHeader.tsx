
type GalleryHeaderProps = {
    imageCount : number;
}

const GalleryHeader = ({imageCount} : GalleryHeaderProps) => {
    
return (
    <>
        <header className="mb-4 rounded-2xl border border-green-100 bg-green-50 p-3 shadow-sm sm:p-3">
            <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                <span className="text-xl">▧</span>
                </div>

                <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-green-950 sm:text-2xl">
                    Image Gallery
                </h1>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Manage your photos in one place
                </p>
                </div>
            </div>

            <div className="shrink-0 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-800">
                {imageCount} { imageCount === 1 ? "Image" : "Images"}
            </div>
            </div>
        </header>
    </>

  )
}

export default GalleryHeader;