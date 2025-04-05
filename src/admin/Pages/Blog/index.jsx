import React, { useState } from "react";
// import BlogCategoryComponent from "../../components/blogCategoryComponent";
// import BlogListComponent from "../../components/blogListComponent";
import { useRouter } from 'next/router';
import BlogCategoryComponent from "../../components/blogCategoryComponent";
import BlogListComponent from "../../components/blogListComponent";

const Blog = () => {
    const location = useRouter();
    console.log("location>>>>", location)

    if (location.pathname === "/admin/blogs") {
        // Blog list page
        return <BlogListComponent />
    }

    if (location.pathname === "/admin/blog-categories") {
        // Blog list page
        return <BlogCategoryComponent />
    }
}

export default Blog;