import React from 'react'
import ProtectRoute from '../../../ProtectRoute'
import DefaultLayout from '../../../admin/layout/DefaultLayout'
import BlogCategoryComponent from '../../../admin/components/blogCategoryComponent'

const BlogCategoryComponentPage = () => {
    return (
        <ProtectRoute>
            <DefaultLayout>
                <BlogCategoryComponent />
            </DefaultLayout>
        </ProtectRoute>
    )
}

export default BlogCategoryComponentPage