// BlogShow.tsx
import { Show, SimpleShowLayout, TextField, ImageField } from "react-admin";

const BlogShowTitle = () => {
  return <span>TLA | Blog Details</span>;
};

export const BlogShow = () => (
  <Show title={<BlogShowTitle />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="content" label="Content" />
      <ImageField source="image" label="Image" />
    </SimpleShowLayout>
  </Show>
);

export default BlogShow;