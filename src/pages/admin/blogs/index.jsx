import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import BlogListComponent from '../../../admin/components/blogListComponent'

const BlogListComponentPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <BlogListComponent />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BlogListComponentPage