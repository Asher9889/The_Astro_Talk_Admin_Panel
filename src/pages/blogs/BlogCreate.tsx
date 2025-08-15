import { useState, useEffect, useCallback } from "react";
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

const BlogCreate = () => {
  const [preview, setPreview] = useState<string | null>(null);

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle file change for preview
  const handleFileChange = useCallback((file: File | null) => {
    // Clean up previous preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setPreview(null);
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setPreview(null);
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [preview]);

  // Transform data for the data provider
  const transform = useCallback((data: any) => {
    // For ra-data-simple-rest, we need to handle file uploads differently
    // Convert file to base64 or handle it according to your backend requirements
    const transformedData = { ...data };
    
    if (data.image && data.image.rawFile) {
      // Option 1: If your backend accepts base64
      // You might need to convert to base64 here
      
      // Option 2: If your backend accepts FormData via multipart/form-data
      // The data provider needs to be configured to handle this
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
          // Clean up preview on successful submission
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
        },
      }}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput 
          source="title" 
          fullWidth 
          validate={[required()]}
          helperText="Enter a descriptive title for your blog post"
        />
        
        <TextInput 
          source="content" 
          multiline 
          fullWidth 
          validate={[required()]}
          helperText="Write your blog content here"
          rows={8}
        />

        <FileInput
          source="image"
          label="Blog Image"
          accept="image/*"
          helperText="Upload an image for your blog post (max 5MB)"
          onChange={(file) => handleFileChange(file?.rawFile || null)}
        >
          <FileField source="src" title="title" />
        </FileInput>

        {preview && (
          <div style={{ 
            marginTop: 16, 
            padding: 16, 
            border: '1px solid #e0e0e0', 
            borderRadius: 4,
            backgroundColor: '#fafafa'
          }}>
            <strong style={{ marginBottom: 8, display: 'block' }}>
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}
      </SimpleForm>
    </Create>
  );
};

export default BlogCreate;
