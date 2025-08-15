import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import BlogCreate from "./pages/blogs/BlogCreate";
import BlogList from "./pages/blogs/BlogList";
import BlogShow from "./pages/blogs/BlogShow";



export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
     <Resource name="blogs" list={BlogList} create={BlogCreate} edit={BlogShow}/>

  </Admin>
);
