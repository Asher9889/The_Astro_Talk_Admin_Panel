// BlogEdit.tsx
import { Edit, SimpleForm, TextInput, ImageField, ImageInput } from "react-admin";

const BlogEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="title" />
      <TextInput source="content" multiline />

      {/* Show current image */}
      <ImageField source="image" label="Current Image" />

      {/* Upload new image */}
      <ImageInput source="image" label="Change Image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export default BlogEdit;