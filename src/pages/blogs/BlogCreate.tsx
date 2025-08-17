import { useState, useEffect, useCallback } from "react";
import { useNotify, useRedirect } from 'react-admin';

import {
  Create,
  SimpleForm,
  TextInput,
  FileInput,
  FileField,
  required,
  SaveButton,
  Toolbar,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";

const BlogCreate = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const notify = useNotify();
  const redirect = useRedirect();

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle file change for preview
  const handleFileChange = useCallback(
    (file: File | null) => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      if (file) {
        if (!file.type.startsWith("image/")) {
          setPreview(null);
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setPreview(null);
          return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    },
    [preview]
  );

  // Transform data for API
  const transform = useCallback((data: any) => {
    const transformedData = { ...data };

    // Ensure content is saved as HTML
    if (typeof data.content === "string") {
      transformedData.content = data.content; // RichTextInput already returns HTML
    }

    // Handle image upload
    if (data.image && data.image.rawFile) {
      transformedData.image = data.image.rawFile;
    }

    return transformedData;
  }, []);

  const CustomToolbar = () => (
    <Toolbar>
      <SaveButton />
    </Toolbar>
  );

  return (
    <Create
      transform={transform}
      mutationOptions={{
        onSuccess: () => {
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
          notify('Blog created successfully!', { type: 'success' });
          redirect('/blogs');  // or redirect to wherever you want
        },
      }}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        {/* Blog Title */}
        <TextInput
          source="title"
          fullWidth
          validate={[required()]}
          helperText="Enter a descriptive title for your blog post"
        />

        {/* Rich Text Editor for Content */}
        <RichTextInput
          source="content"
          fullWidth
          validate={[required()]}
          helperText="Write your blog content with formatting"
        />

        {/* Image Upload */}
        <FileInput
          source="image"
          label="Blog Image"
          //@ts-ignoreW
          accept="image/*"
          //@ts-check
          helperText="Upload an image for your blog post (max 5MB)"
          onChange={(file) => handleFileChange(file?.rawFile || null)}
        >
          <FileField source="src" title="title" />
        </FileInput>

        {/* Image Preview */}
        {preview && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              backgroundColor: "#fafafa",
            }}
          >
            <strong style={{ marginBottom: 8, display: "block" }}>
              Image Preview:
            </strong>
            <img
              src={preview}
              alt="Blog preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                display: "block",
                borderRadius: 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}
      </SimpleForm>
    </Create>
  );
};

export default BlogCreate;
