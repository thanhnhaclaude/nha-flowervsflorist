import Link from "next/link";
import { AdminHeader } from "../../ui";
import { PostForm } from "../post-form";

export const metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <>
      <Link href="/admin/posts" className="mb-3 inline-block text-sm font-bold text-plum-600 hover:underline">
        ← All posts
      </Link>
      <AdminHeader title="New post" />
      <PostForm />
    </>
  );
}
