export const checkImage = (file: File): string => {
  let err = "";
  if (!file) return (err = "File does not exist");

  if (file.size > 1024 * 1024)
    // 1mb
    err = "The largest image size is 1mb.";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Image format is incorrect";

  return err;
};

export const imageUpload = async (images: any) => {
  let imgArr: any = [];
  for (const item of images) {
    const formData = new FormData();

    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }

    formData.append("upload_preset", "szjad0sd");
    formData.append("cloud_name", "dkdmapwfv");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkdmapwfv/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data: any = await response.json();
      imgArr.push({ public_id: data.public_id, url: data.secure_url });
    } catch (err) {
      console.log(err);
    }
  }
  return imgArr;
};

export const filePdfUpload = async (files: any) => {
  const file = files?.length ? files[0] : null;
  let fileUpload = "";

  if (!file) return;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/davidchoi15052000/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data: any = await response.json();
    fileUpload = data?.secure_url;
  } catch (err) {
    console.log(err);
  }
  return fileUpload;
};
