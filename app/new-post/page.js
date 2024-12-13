import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
import FormPost from "@/components/post-form";
import { uploadImage } from "@/lib/cloudinary";

console.log(uploadImage)

export default function NewPostPage() {
  async function createPost(prevState, formData) {
    "use server";
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    console.log(title, image, content);

    const errors = [];

    if (!title || title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!content || content.trim().length === 0) {
      errors.push("Content is required");
    }

    if (!image || image.size === 0) {
      errors.push("Image is required");
    }

    if (errors.length > 0) {
      return { errors };
    }

    let imageUrl;

    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      console.log(error.message)
      console.log('API Key:', process.env.CLOUDINARY_API_KEY);
      throw new Error("Image upload failed");
    }

    await storePost({
      imageUrl: imageUrl,
      title,
      content,
      userId: "1",
    });

    redirect("/feed");
  }

  return <FormPost action={createPost} />;
}
