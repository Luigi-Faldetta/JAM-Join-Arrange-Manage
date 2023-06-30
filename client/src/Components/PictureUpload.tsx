import { ChangeEvent, useState } from "react";
// import { Cloudinary } from "@cloudinary/url-gen";

function PictureUpload({
  eventFile,
  setEventFile,
}: {
  eventFile: File | null;
  setEventFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  // const [imageUrl, setImageUrl] = useState<string | null>(null);

  // const cld = new Cloudinary({ cloud: { cloudName: "de4bu4ijj" } });

  // const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const data = new FormData();
  //     data.append("file", file);
  //     data.append("upload_preset", "tdzb6v4z");
  //     data.append("cloud_name", "de4bu4ijj");

  //     try {
  //       const res = await fetch(
  //         "https://api.cloudinary.com/v1_1/de4bu4ijj/image/upload",
  //         {
  //           method: "post",
  //           body: data,
  //         }
  //       );

  //       const uploadedImage = await res.json();

  //       setImageUrl(uploadedImage.url);

  //       // Send the url to the backend to update the post

  //       console.log("Image form cloudinary ==> ", uploadedImage);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     return;
  //   }
  // };

  return (
    <div className="flex items-center justify-center w-full rounded-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-52 h-52 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center w-52 h-52 rounded-full overflow-hidden">
          {eventFile ? (
            <img
              src={`${eventFile}`}
              width="100"
              height="100"
              className="object-cover w-full h-full "
            ></img>
          ) : (
            <div className="flex flex-col">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400 self-center"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                Click to upload photo
              </p>
            </div>
          )}
        </div>
        {/* <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0]!)}
        /> */}
      </label>
    </div>
  );
}

export default PictureUpload;
