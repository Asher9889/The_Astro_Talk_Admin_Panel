import { Edit, SimpleForm, TextInput, ImageField, ImageInput, required } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";

const BlogEditTitle = () => {
  return <span>TLA | Edit Blog</span>;
};

const BlogEdit = () => (
  <Edit title={<BlogEditTitle />}>
    <SimpleForm>
      {/* ID (read-only) */}
      <TextInput source="id" disabled />

      {/* Blog Title */}
      <TextInput 
        source="title" 
        fullWidth 
        validate={[required()]} 
      />

      {/* Rich Text Editor for Content */}
      <RichTextInput 
        source="content" 
        fullWidth 
        validate={[required()]} 
      />

      {/* Show current image */}
      <ImageField 
        source="image" 
        label="Current Image" 
        sx={{ maxWidth: 300, borderRadius: 2 }}
      />

      {/* Upload new image */}
      <ImageInput 
        source="image" 
        label="Change Image" 
        // @ts-ignore
        accept="image/*"
      >
        <ImageField source="src" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export default BlogEdit;
