import { List, Datagrid, TextField, ImageField } from "react-admin";

const BlogList = () => (
    <List
        perPage={10} // matches range [0,9]
        sort={{ field: "id", order: "ASC" }}
    >
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="title" />
            <ImageField source="image" label="Image" />
        </Datagrid>
    </List>
);

export default BlogList;
